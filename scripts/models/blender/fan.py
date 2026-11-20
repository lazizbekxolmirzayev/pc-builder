import bpy, math, sys
bpy.ops.wm.read_factory_settings(use_empty=True)
def mat(name,c,metal,rough,em=None,alpha=1.0,trans=0.0):
    m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*c,1);b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough
    if em: b.inputs['Emission Color'].default_value=(*em,1);b.inputs['Emission Strength'].default_value=1.0
    return m
frame=mat('fan.frame',(0.012,0.012,0.014),0.0,0.55)
blade=mat('fan.blade',(0.85,0.86,0.9),0.0,0.35,em=(0.35,0.75,1.0))
ring=mat('fan.argb',(0.9,0.95,1.0),0.0,0.25,em=(0.3,0.8,1.0))
hub=mat('fan.hub',(0.02,0.02,0.025),0.2,0.4)
S=0.12;T=0.025;R=0.0585
bpy.ops.mesh.primitive_cube_add(size=1);f=bpy.context.object;f.scale=(S,S,T);bpy.ops.object.transform_apply(scale=True)
bv=f.modifiers.new('bv','BEVEL');bv.width=0.006;bv.segments=4;bv.limit_method='ANGLE';bpy.ops.object.modifier_apply(modifier='bv')
bpy.ops.mesh.primitive_cylinder_add(radius=R,depth=T*2,vertices=96);cut=bpy.context.object
bo=f.modifiers.new('b','BOOLEAN');bo.object=cut;bo.operation='DIFFERENCE';bpy.context.view_layer.objects.active=f;bpy.ops.object.modifier_apply(modifier='b')
bpy.data.objects.remove(cut)
for sx in (-1,1):
  for sy in (-1,1):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.0025,depth=T*2,location=(sx*0.0525,sy*0.0525,0),vertices=16);c=bpy.context.object
    bo=f.modifiers.new('b','BOOLEAN');bo.object=c;bo.operation='DIFFERENCE';bpy.context.view_layer.objects.active=f;bpy.ops.object.modifier_apply(modifier='b');bpy.data.objects.remove(c)
f.data.materials.append(frame)
# ARGB diffuser rings front+back
for z in (T/2-0.0015,-T/2+0.0015):
    bpy.ops.mesh.primitive_torus_add(major_radius=R-0.0005,minor_radius=0.0022,major_segments=96,minor_segments=12,location=(0,0,z));bpy.context.object.data.materials.append(ring)
# hub
bpy.ops.mesh.primitive_cylinder_add(radius=0.021,depth=T*0.9,vertices=64);h=bpy.context.object;h.data.materials.append(hub)
bv=h.modifiers.new('bv','BEVEL');bv.width=0.002;bv.segments=3;bpy.ops.object.modifier_apply(modifier='bv')
# stator struts (rear)
for i in range(4):
    a=i*math.pi/2+math.pi/4
    bpy.ops.mesh.primitive_cube_add(size=1,location=(math.cos(a)*0.04,math.sin(a)*0.04,-T/2+0.002),rotation=(0,0,a));s=bpy.context.object;s.scale=(0.04,0.003,0.003);s.data.materials.append(frame)
# 9 swept blades
for i in range(9):
    a=i*2*math.pi/9
    bpy.ops.mesh.primitive_cube_add(size=1);b=bpy.context.object;b.scale=(0.038,0.026,0.0012);bpy.ops.object.transform_apply(scale=True)
    sw=b.modifiers.new('tw','SIMPLE_DEFORM');sw.deform_method='TWIST';sw.angle=math.radians(25);sw.deform_axis='X'
    bd=b.modifiers.new('bd','SIMPLE_DEFORM');bd.deform_method='BEND';bd.angle=math.radians(35);bd.deform_axis='Z'
    sub=b.modifiers.new('s','SUBSURF');sub.levels=1
    for mname in ('tw','bd','s'):bpy.ops.object.modifier_apply(modifier=mname)
    b.location=(math.cos(a)*0.039,math.sin(a)*0.039,0);b.rotation_euler=(math.radians(28),0,a);b.data.materials.append(blade)
    for p in b.data.polygons:p.use_smooth=True
bpy.ops.export_scene.gltf(filepath=sys.argv[-1],export_format='GLB',export_yup=True)
