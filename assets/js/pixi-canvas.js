var debugDraw;
var STAGE_WIDTH, STAGE_HEIGHT;
var METER = 100;
var SCALE = 4;
var STEP = 1/60;
var MAX = 60;

var bodies = [], actors = [];
var stage, renderer;
var world, mouseJoint;
var touchX, touchY;
var isBegin;
var dd = {x:1, y:1, px:10, py:40};
var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(callback) { return window.setTimeout(callback, 1000 / 60); };
window.onload = init;

function init() {

	var target = document.getElementById("header")


    STAGE_WIDTH = 256*SCALE;
    STAGE_HEIGHT = 256*target.offsetHeight/target.offsetWidth*SCALE;
    dd.x = STAGE_WIDTH/window.innerWidth;
    stage = new PIXI.Stage(0x383838, true);
    renderer = PIXI.autoDetectRenderer(STAGE_WIDTH, STAGE_HEIGHT, null);
	renderer.view.id = "pixi-canvas";
	
	target.appendChild(renderer.view);			
    
    var loader = new PIXI.AssetLoader(["assets/image/dog-paw.png"]);
    loader.onComplete = onLoadAssets;
    loader.load();
    window.addEventListener("resize", resize, false);

}

function onLoadAssets() {
    // var tiling = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/img/black.jpg"), STAGE_WIDTH, STAGE_HEIGHT);
    // stage.addChild(tiling);
    var gravity = new Box2D.Common.Math.b2Vec2(0, 5);
    world = new Box2D.Dynamics.b2World(gravity,  true);
    
    var polyFixture = new Box2D.Dynamics.b2FixtureDef();
    polyFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    polyFixture.density = 1;
    
    var bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
    
    //down
    polyFixture.shape.SetAsBox(10, 1);
    bodyDef.position.Set(9, STAGE_HEIGHT / METER + 1);
    world.CreateBody(bodyDef).CreateFixture(polyFixture);
    
    //left
    polyFixture.shape.SetAsBox(1, 100);
    bodyDef.position.Set(-1, 0);
    world.CreateBody(bodyDef).CreateFixture(polyFixture);
    
    //right
    bodyDef.position.Set(STAGE_WIDTH / METER + 1, 0);
    world.CreateBody(bodyDef).CreateFixture(polyFixture);
    // add some object
    populate();
    
    debugDraw = new Box2D.Dynamics.b2DebugDraw();
    debugDraw.SetSprite(renderer.view);
    debugDraw.SetDrawScale(25.0);
    debugDraw.SetFillAlpha(0.3);
    
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(true);
    world.SetDebugDraw(debugDraw);
    raf(update);
}
function populate(n) {
    if(n) MAX = n;
    for (var i = 0; i < MAX; i++) {
        var pos = {x: MathTools.randomRange(0, STAGE_WIDTH) / METER, y:-MathTools.randomRange(50, 5000) / METER};
        var size;
        size = { w:MathTools.randomRange(30, 60), h:MathTools.randomRange(30, 60) };
        addCircle(pos, size);
    }
}

function addCircle(pos, size) {
    var radius = size.w / METER*1.3;
    var bodyDef = new Box2D.Dynamics.b2BodyDef()
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.Set(pos.x, pos.y);
    var fd = new Box2D.Dynamics.b2FixtureDef();
    fd.shape = new Box2D.Collision.Shapes.b2CircleShape();
    console.log(radius)
    fd.shape.SetRadius(radius);
    fd.restitution = 0.3;
    fd.friction = 0.3;
    fd.density = 1;
    

    var body = world.CreateBody(bodyDef);
    body.CreateFixture(fd);
    var ball = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/image/dog-paw.png"));
    ball.alpha = 0.05 + 0.5*Math.random();
    stage.addChild(ball);
    ball.anchor.x = ball.anchor.y = 0.5;
    ball.scale.x = ball.scale.y = size.w / 128;


    bodies.push(body);
    actors.push(ball);
}

function update() {
    if(isBegin && !mouseJoint) {
        var dragBody = getBodyAtMouse();
        if(dragBody) {
            var jointDef = new Box2D.Dynamics.Joints.b2MouseJointDef();
            jointDef.bodyA = world.GetGroundBody();
            jointDef.bodyB = dragBody;
            jointDef.target.Set(touchX, touchY);
            jointDef.collideConnected = true;
            jointDef.maxForce = 300.0 * dragBody.GetMass();
            mouseJoint = world.CreateJoint(jointDef);
            dragBody.SetAwake(true);
        }
    }
    
    world.Step( STEP, 3, 3);
    world.ClearForces();
    
    var n = actors.length;
    for (var i = 0; i < n; i++) {
        var body  = bodies[i];
        var actor = actors[i];
        var position = body.GetPosition();
        actor.position.x = position.x * 100;
        actor.position.y = position.y * 100;
        actor.rotation = body.GetAngle();
    }

    renderer.render(stage);
    raf(update);
}

function resize() {
    renderer.view.style.width = window.innerWidth-20+"px";
    renderer.view.style.height = (window.innerWidth-20)*0.5+ "px";
    dd.x = STAGE_WIDTH/window.innerWidth;
}
