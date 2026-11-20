import bpy, bmesh, math, sys
bpy.ops.wm.read_factory_settings(use_empty=True)
W,D,TOP,TH=1.60,0.75,0.74,0.035
import os
H=os.path.join(os.path.dirname(__file__),'textures')+'/'
def mat_wood():
    m=bpy.data.materials.new('desk.walnut');m.use_nodes=True;nt=m.node_tree;b=nt.nodes['Principled BSDF']
    tx=nt.nodes.new('ShaderNodeTexImage');tx.image=bpy.data.images.load(H+'hardwood2_diffuse.jpg')
    tr=nt.nodes.new('ShaderNodeTexImage');tr.image=bpy.data.images.load(H+'hardwood2_roughness.jpg');tr.image.colorspace_settings.name='Non-Color'
    # darken diffuse slightly towards walnut
    mix=nt.nodes.new('ShaderNodeMix');mix.data_type='RGBA';mix.blend_type='MULTIPLY';mix.inputs['Factor'].default_value=0.55
    mix.inputs['B'].default_value=(0.55,0.36,0.24,1)
    nt.links.new(tx.outputs['Color'],mix.inputs['A']);nt.links.new(mix.outputs['Result'],b.inputs['Base Color'])
    nt.links.new(tr.outputs['Color'],b.inputs['Roughness'])
    return m
def mat(name,c,metal,rough):
    m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*c,1);b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough;return m
wood=mat_wood();steel=mat('desk.steel',(0.018,0.018,0.02),0.85,0.38);pad=mat('desk.foot',(0.01,0.01,0.01),0,0.7)
def box(name,sx,sy,sz,loc,m,bev=0.0,seg=3):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.scale=(sx,sy,sz)
    bpy.ops.object.transform_apply(scale=True)
    if bev>0:
        md=o.modifiers.new('b','BEVEL');md.width=bev;md.segments=seg;md.limit_method='ANGLE'
        bpy.ops.object.modifier_apply(modifier='b')
    o.data.materials.append(m)
    for p in o.data.polygons:p.use_smooth=True
    return o
top=box('desk_top',W,D,TH,(0,0,TOP-TH/2),wood,0.006,4)
# UV: project from top so the grain runs along the width
bpy.context.view_layer.objects.active=top;bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.cube_project(cube_size=1.2);bpy.ops.object.mode_set(mode='OBJECT')
# steel frame: two side legs (T-shape), cross beam
for sx in (-1,1):
    x=sx*(W/2-0.09)
    box('leg',0.06,0.06,TOP-TH-0.04,(x,0,(TOP-TH-0.04)/2+0.04),steel,0.004)
    box('foot',0.07,D-0.06,0.04,(x,0,0.02),steel,0.004)
    box('arm',0.05,D-0.12,0.03,(x,0,TOP-TH-0.015),steel,0.003)
    for sy in (-1,1): box('pad',0.05,0.04,0.008,(x,sy*(D/2-0.06),0.004),pad,0.002)
box('beam',W-0.2,0.04,0.06,(0,0.12,TOP-TH-0.08),steel,0.003)
box('cable_tray',W*0.55,0.12,0.004,(0,0.24,TOP-TH-0.13),steel,0.001)
bpy.ops.export_scene.gltf(filepath=sys.argv[-1],export_format='GLB',export_yup=True,export_image_format='JPEG')
