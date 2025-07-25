//Leave A LIke And Follow For More Free Contents
// This script sets up a simple animation of a creature with segments and limbs By MadebyAkshar, Instagram: @ig.madebyakshar// Use This Content For Free
// Do not remove the credits, you can use this code in your projects but do not remove.
var Input = {
    keys: [],
    mouse: {
      left: false,
      right: false,
      middle: false,
      x: 0,
      y: 0
    }
  };
  for (var i = 0; i < 230; i++) {
    Input.keys.push(false);
  }
  document.addEventListener("keydown", function(event) {
    Input.keys[event.keyCode] = true;
  });
  document.addEventListener("keyup", function(event) {
    Input.keys[event.keyCode] = false;
  });
  document.addEventListener("mousedown", function(event) {
    if ((event.button = 0)) {
      Input.mouse.left = true;
    }
    if ((event.button = 1)) {
      Input.mouse.middle = true;
    }
    if ((event.button = 2)) {
      Input.mouse.right = true;
    }
  });
  document.addEventListener("mouseup", function(event) {
    if ((event.button = 0)) {
      Input.mouse.left = false;
    }
    if ((event.button = 1)) {
      Input.mouse.middle = false;
    }
    if ((event.button = 2)) {
      Input.mouse.right = false;
    }
  });
  document.addEventListener("mousemove", function(event) {
    Input.mouse.x = event.clientX;
    Input.mouse.y = event.clientY;
  });
  //Sets up canvas
  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = Math.max(window.innerWidth, window.innerWidth);
  
  //canvas.height = Math.max(window.innerWidth, window.innerWidth);
  
//Leave A LIke And Follow For More Free Contents
// This script sets up a simple animation of a creature with segments and limbs By MadebyAkshar, Instagram: @ig.madebyakshar// Use This Content For Free
// Do not remove the credits, you can use this code in your projects but do not remove.

  canvas.height = window.innerHeight;
  canvas.style.position = "absolute";
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  document.body.style.overflow = "hidden";
  var ctx = canvas.getContext("2d");
  //Necessary classes
  var segmentCount = 0;
  class Segment {
    constructor(parent, size, angle, range, stiffness) {
      segmentCount++;
      this.isSegment = true;
      this.parent = parent; //Segment which this one is connected to
      if (typeof parent.children == "object") {
        parent.children.push(this);
      }
      this.children = []; //Segments connected to this segment
      this.size = size; //Distance from parent
      this.relAngle = angle; //Angle relative to parent
      this.defAngle = angle; //Default angle relative to parent
      this.absAngle = parent.absAngle + angle; //Angle relative to x-axis
      this.range = range; //Difference between maximum and minimum angles
      this.stiffness = stiffness; //How closely it conforms to default angle
      this.updateRelative(false, true);
    }
    updateRelative(iter, flex) {
      this.relAngle =
        this.relAngle -
        2 *
          Math.PI *
          Math.floor((this.relAngle - this.defAngle) / 2 / Math.PI + 1 / 2);
      if (flex) {
        //		this.relAngle=this.range/
        //				(1+Math.exp(-4*(this.relAngle-this.defAngle)/
        //				(this.stiffness*this.range)))
        //			  -this.range/2+this.defAngle;
        this.relAngle = Math.min(
          this.defAngle + this.range / 2,
          Math.max(
            this.defAngle - this.range / 2,
            (this.relAngle - this.defAngle) / this.stiffness + this.defAngle
          )
        );
      }
      this.absAngle = this.parent.absAngle + this.relAngle;
      this.x = this.parent.x + Math.cos(this.absAngle) * this.size; //Position
      this.y = this.parent.y + Math.sin(this.absAngle) * this.size; //Position
      if (iter) {
        for (var i = 0; i < this.children.length; i++) {
          this.children[i].updateRelative(iter, flex);
        }
      }
    }
    draw(iter) {
      ctx.beginPath();
      ctx.moveTo(this.parent.x, this.parent.y);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      if (iter) {
        for (var i = 0; i < this.children.length; i++) {
          this.children[i].draw(true);
        }
      }
    }
    follow(iter) {
      var x = this.parent.x;
      var y = this.parent.y;
      var dist = ((this.x - x) ** 2 + (this.y - y) ** 2) ** 0.5;
      this.x = x + this.size * (this.x - x) / dist;
      this.y = y + this.size * (this.y - y) / dist;
      this.absAngle = Math.atan2(this.y - y, this.x - x);
      this.relAngle = this.absAngle - this.parent.absAngle;
      this.updateRelative(false, true);
      //this.draw();
      if (iter) {
        for (var i = 0; i < this.children.length; i++) {
          this.children[i].follow(true);
        }
      }
    }
  }
  class LimbSystem {
    constructor(end, length, speed, creature) {
      this.end = end;
      this.length = Math.max(1, length);
      this.creature = creature;
      this.speed = speed;
      creature.systems.push(this);
      this.nodes = [];
      var node = end;
      for (var i = 0; i < length; i++) {
        this.nodes.unshift(node);
        //node.stiffness=1;
        node = node.parent;
        if (!node.isSegment) {
          this.length = i + 1;
          break;
        }
      }
      this.hip = this.nodes[0].parent;
    }
    moveTo(x, y) {
      this.nodes[0].updateRelative(true, true);
      var dist = ((x - this.end.x) ** 2 + (y - this.end.y) ** 2) ** 0.5;
      var len = Math.max(0, dist - this.speed);
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        var node = this.nodes[i];
        var ang = Math.atan2(node.y - y, node.x - x);
        node.x = x + len * Math.cos(ang);
        node.y = y + len * Math.sin(ang);
        x = node.x;
        y = node.y;
        len = node.size;
      }
      for (var i = 0; i < this.nodes.length; i++) {
        var node = this.nodes[i];
        node.absAngle = Math.atan2(
          node.y - node.parent.y,
          node.x - node.parent.x
        );
        node.relAngle = node.absAngle - node.parent.absAngle;
        for (var ii = 0; ii < node.children.length; ii++) {
          var childNode = node.children[ii];
          if (!this.nodes.includes(childNode)) {
            childNode.updateRelative(true, false);
          }
        }
      }
      //this.nodes[0].updateRelative(true,false)
    }
    update() {
      this.moveTo(Input.mouse.x, Input.mouse.y);
    }
  }

  //Leave A LIke And Follow For More Free Contents
// This script sets up a simple animation of a creature with segments and limbs By MadebyAkshar, Instagram: @ig.madebyakshar// Use This Content For Free
// Do not remove the credits, you can use this code in your projects but do not remove.
  class LegSystem extends LimbSystem {
    constructor(end, length, speed, creature) {
      super(end, length, speed, creature);
      this.goalX = end.x;
      this.goalY = end.y;
      this.step = 0; //0 stand still, 1 move forward,2 move towards foothold
      this.forwardness = 0;
  
      //For foot goal placement
      this.reach =
        0.9 *
        ((this.end.x - this.hip.x) ** 2 + (this.end.y - this.hip.y) ** 2) ** 0.5;
      var relAngle =
        this.creature.absAngle -
        Math.atan2(this.end.y - this.hip.y, this.end.x - this.hip.x);
      relAngle -= 2 * Math.PI * Math.floor(relAngle / 2 / Math.PI + 1 / 2);
      this.swing = -relAngle + (2 * (relAngle < 0) - 1) * Math.PI / 2;
      this.swingOffset = this.creature.absAngle - this.hip.absAngle;
      //this.swing*=(2*(relAngle>0)-1);
    }
    update(x, y) {
      this.moveTo(this.goalX, this.goalY);
      // Heavy screen scale (zoom) effect when leg lands
      if (this.step == 0 && !this.hasLanded) {
        screenScale();
        this.hasLanded = true;
      }
      if (this.step != 0) {
        this.hasLanded = false;
      }
      //this.nodes[0].follow(true,true)
      if (this.step == 0) {
        var dist =
          ((this.end.x - this.goalX) ** 2 + (this.end.y - this.goalY) ** 2) **
          0.5;
        if (dist > 1) {
          this.step = 1;
          //this.goalX=x;
          //this.goalY=y;
          this.goalX =
            this.hip.x +
            this.reach *
              Math.cos(this.swing + this.hip.absAngle + this.swingOffset) +
            (2 * Math.random() - 1) * this.reach / 2;
          this.goalY =
            this.hip.y +
            this.reach *
              Math.sin(this.swing + this.hip.absAngle + this.swingOffset) +
            (2 * Math.random() - 1) * this.reach / 2;
        }
      } else if (this.step == 1) {
        var theta =
          Math.atan2(this.end.y - this.hip.y, this.end.x - this.hip.x) -
          this.hip.absAngle;
        var dist =
          ((this.end.x - this.hip.x) ** 2 + (this.end.y - this.hip.y) ** 2) **
          0.5;
        var forwardness2 = dist * Math.cos(theta);
        var dF = this.forwardness - forwardness2;
        this.forwardness = forwardness2;
        if (dF * dF < 1) {
          this.step = 0;
          this.goalX = this.hip.x + (this.end.x - this.hip.x);
          this.goalY = this.hip.y + (this.end.y - this.hip.y);
        }
      }
      //	ctx.strokeStyle='blue';
      //	ctx.beginPath();
      //	ctx.moveTo(this.end.x,this.end.y);
      //	ctx.lineTo(this.hip.x+this.reach*Math.cos(this.swing+this.hip.absAngle+this.swingOffset),
      //				this.hip.y+this.reach*Math.sin(this.swing+this.hip.absAngle+this.swingOffset));
      //	ctx.stroke();
      //	ctx.strokeStyle='black';
    }
  }
  class Creature {
    constructor(
      x,
      y,
      angle,
      fAccel,
      fFric,
      fRes,
      fThresh,
      rAccel,
      rFric,
      rRes,
      rThresh
    ) {
      this.x = x; //Starting position
      this.y = y;
      this.absAngle = angle; //Staring angle
      this.fSpeed = 0; //Forward speed
      this.fAccel = fAccel; //Force when moving forward
      this.fFric = fFric; //Friction against forward motion
      this.fRes = fRes; //Resistance to motion
      this.fThresh = fThresh; //minimum distance to target to keep moving forward
      this.rSpeed = 0; //Rotational speed
      this.rAccel = rAccel; //Force when rotating
      this.rFric = rFric; //Friction against rotation
      this.rRes = rRes; //Resistance to rotation
      this.rThresh = rThresh; //Maximum angle difference before rotation
      this.children = [];
      this.systems = [];
    }
    follow(x, y) {
      var dist = ((this.x - x) ** 2 + (this.y - y) ** 2) ** 0.5;
      var angle = Math.atan2(y - this.y, x - this.x);
      //Update forward
      var accel = this.fAccel;
      if (this.systems.length > 0) {
        var sum = 0;
        for (var i = 0; i < this.systems.length; i++) {
          sum += this.systems[i].step == 0;
        }
        accel *= sum / this.systems.length;
      }
      this.fSpeed += accel * (dist > this.fThresh);
      this.fSpeed *= 1 - this.fRes;
      this.speed = Math.max(0, this.fSpeed - this.fFric);
      //Update rotation
      var dif = this.absAngle - angle;
      dif -= 2 * Math.PI * Math.floor(dif / (2 * Math.PI) + 1 / 2);
      if (Math.abs(dif) > this.rThresh && dist > this.fThresh) {
        this.rSpeed -= this.rAccel * (2 * (dif > 0) - 1);
      }
      this.rSpeed *= 1 - this.rRes;
      if (Math.abs(this.rSpeed) > this.rFric) {
        this.rSpeed -= this.rFric * (2 * (this.rSpeed > 0) - 1);
      } else {
        this.rSpeed = 0;
      }
  
      //Update position
      this.absAngle += this.rSpeed;
      this.absAngle -=
        2 * Math.PI * Math.floor(this.absAngle / (2 * Math.PI) + 1 / 2);
      this.x += this.speed * Math.cos(this.absAngle);
      this.y += this.speed * Math.sin(this.absAngle);
      this.absAngle += Math.PI;
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].follow(true, true);
      }
      for (var i = 0; i < this.systems.length; i++) {
        this.systems[i].update(x, y);
      }
      this.absAngle -= Math.PI;
      this.draw(true);
    }
    draw(iter) {
      var r = 4;
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        r,
        Math.PI / 4 + this.absAngle,
        7 * Math.PI / 4 + this.absAngle
      );
      ctx.moveTo(
        this.x + r * Math.cos(7 * Math.PI / 4 + this.absAngle),
        this.y + r * Math.sin(7 * Math.PI / 4 + this.absAngle)
      );
      ctx.lineTo(
        this.x + r * Math.cos(this.absAngle) * 2 ** 0.5,
        this.y + r * Math.sin(this.absAngle) * 2 ** 0.5
      );
      ctx.lineTo(
        this.x + r * Math.cos(Math.PI / 4 + this.absAngle),
        this.y + r * Math.sin(Math.PI / 4 + this.absAngle)
      );
      ctx.stroke();
      if (iter) {
        for (var i = 0; i < this.children.length; i++) {
          this.children[i].draw(true);
        }
      }
    }
  }
  //Initializes and animates, Go ahead boy!!
  var critter;
  function setupSimple() {
    //(x,y,angle,fAccel,fFric,fRes,fThresh,rAccel,rFric,rRes,rThresh)
    var critter = new Creature(
      window.innerWidth / 2,
      window.innerHeight / 2,
      0,
      12,
      1,
      0.5,
      16,
      0.5,
      0.085,
      0.5,
      0.3
    );
    var node = critter;
    //(parent,size,angle,range,stiffness)
    for (var i = 0; i < 128; i++) {
      var node = new Segment(node, 8, 0, 3.14159 / 2, 1);
    }
    setInterval(function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      critter.follow(Input.mouse.x, Input.mouse.y);
    }, 33);
  }
  function setupTentacle() {
    //(x,y,angle,fAccel,fFric,fRes,fThresh,rAccel,rFric,rRes,rThresh)
    critter = new Creature(
      window.innerWidth / 2,
      window.innerHeight / 2,
      0,
      12,
      1,
      0.5,
      16,
      0.5,
      0.085,
      0.5,
      0.3
    );
    var node = critter;
    //(parent,size,angle,range,stiffness)
    for (var i = 0; i < 32; i++) {
      var node = new Segment(node, 8, 0, 2, 1);
    }
    //(end,length,speed,creature)
    var tentacle = new LimbSystem(node, 32, 8, critter);
    setInterval(function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      critter.follow(canvas.width / 2, canvas.height / 2);
      ctx.beginPath();
      ctx.arc(Input.mouse.x, Input.mouse.y, 2, 0, 6.283);
      ctx.fill();
    }, 33);
  }
  function setupArm() {
    //(x,y,angle,fAccel,fFric,fRes,fThresh,rAccel,rFric,rRes,rThresh)
    var critter = new Creature(
      window.innerWidth / 2,
      window.innerHeight / 2,
      0,
      12,
      1,
      0.5,
      16,
      0.5,
      0.085,
      0.5,
      0.3
    );
    var node = critter;
    //(parent,size,angle,range,stiffness)
    for (var i = 0; i < 3; i++) {
      var node = new Segment(node, 80, 0, 3.1416, 1);
    }
    var tentacle = new LimbSystem(node, 3, critter);
    setInterval(function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      critter.follow(canvas.width / 2, canvas.height / 2);
    }, 33);
    ctx.beginPath();
    ctx.arc(Input.mouse.x, Input.mouse.y, 2, 0, 6.283);
    ctx.fill();
  }
  
  function setupTestSquid(size, legs) {
    critter = new Creature(
      window.innerWidth / 2,
      window.innerHeight / 2,
      0,
      size * 10,
      size * 3,
      0.5,
      16,
      0.5,
      0.085,
      0.5,
      0.3
    );
    var legNum = legs;
    var jointNum = 32;
    for (var i = 0; i < legNum; i++) {
      var node = critter;
      var ang = Math.PI / 2 * (i / (legNum - 1) - 0.5);
      for (var ii = 0; ii < jointNum; ii++) {
        var node = new Segment(
          node,
          size * 64 / jointNum,
          ang * (ii == 0),
          3.1416,
          1.2
        );
      }
      //(end,length,speed,creature,dist)
      var leg = new LegSystem(node, jointNum, size * 30, critter);
    }
    setInterval(function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      critter.follow(Input.mouse.x, Input.mouse.y);
    }, 33);
  }
function setupLizard(size, legs, tail) {

  let fadedText = document.getElementById('akshar-bg-text');
  if (!fadedText) {
    fadedText = document.createElement('div');
    fadedText.id = 'akshar-bg-text'; // Unique ID for the text element
    fadedText.textContent = 'MadeByAkshar'; // Change this text to whatever you want.
    fadedText.style.position = 'fixed';
    fadedText.style.left = '50%';
    fadedText.style.top = '50%';
    fadedText.style.transform = 'translate(-50%,-50%)';
    fadedText.style.fontSize = 'min(12vw, 12vh)';
    fadedText.style.fontWeight = 'bold';
    fadedText.style.color = '#fff';
    fadedText.style.opacity = '0.18'; //Change opacity to make it more faded.
    fadedText.style.letterSpacing = '0.1em';
    fadedText.style.userSelect = 'none';
    fadedText.style.pointerEvents = 'none';
    fadedText.style.zIndex = '2'; // Ensure above canvas
    fadedText.style.textShadow = '0 0 32px #fff, 0 0 8px #fff, 0 0 2px #fff';
    document.body.insertBefore(fadedText, document.body.firstChild);
  }

  
  let lastTailSegment = null;
  // Flame particles state
  let flameParticles = [];
  var s = size;
  // Make dragon slower: reduce forward acceleration and speed
  critter = new Creature(
    window.innerWidth / 2,
    window.innerHeight / 2,
    0,
    s * 2.0, // even slower forward acceleration
    s * 0.32,  // even slower forward speed
    0.5,
    0.6,
    0.5,
    0.085,
    0.5,
    0.3
  );
  var spinal = critter;
  for (var i = 0; i < 6; i++) {
    spinal = new Segment(spinal, s * 4, 0, 3.1415 * 2 / 3, 1.1);
    for (var ii = -1; ii <= 1; ii += 2) {
      var node = new Segment(spinal, s * 3, ii, 0.1, 2);
      for (var iii = 0; iii < 3; iii++) {
        node = new Segment(node, s * 0.1, -ii * 0.1, 0.1, 2);
      }
    }
  }
  for (var i = 0; i < legs; i++) {
    if (i > 0) {
      for (var ii = 0; ii < 6; ii++) {
        spinal = new Segment(spinal, s * 4, 0, 1.571, 1.5);
        for (var iii = -1; iii <= 1; iii += 2) {
          var node = new Segment(spinal, s * 3, iii * 1.571, 0.1, 1.5);
          for (var iv = 0; iv < 3; iv++) {
            node = new Segment(node, s * 3, -iii * 0.3, 0.1, 2);
          }
        }
      }
    }
    for (var ii = -1; ii <= 1; ii += 2) {
      var node = new Segment(spinal, s * 12, ii * 0.785, 0, 8);
      node = new Segment(node, s * 16, -ii * 0.785, 6.28, 1);
      node = new Segment(node, s * 16, ii * 1.571, 3.1415, 2);
      for (
        var iii = 0;
        iii < 4;
        iii++
      ) {
        new Segment(node, s * 4, (iii / 3 - 0.5) * 1.571, 0.1, 4);
      }
      new LegSystem(node, 3, s * 12, critter, 4);
    }
  }
  for (var i = 0; i < tail; i++) {
    spinal = new Segment(spinal, s * 4, 0, 3.1415 * 2 / 3, 1.1);
    for (var ii = -1; ii <= 1; ii += 2) {
      var node = new Segment(spinal, s * 3, ii, 0.1, 2);
      for (var iii = 0; iii < 3; iii++) {
        node = new Segment(node, s * 3 * (tail - i) / tail, -ii * 0.1, 0.1, 2);
        // After the last tail segment is created, store it
        if (i === tail - 1 && ii === 1 && iii === 2) {
          lastTailSegment = node;
        }
      }
    }
  }

  // --- Animation loop with FPS counter and dynamic music volume --- //
  let fpsDiv = document.getElementById('fps-counter');
  if (!fpsDiv) {
    fpsDiv = document.createElement('div');
    fpsDiv.id = 'fps-counter';
    fpsDiv.style.position = 'fixed';
    fpsDiv.style.bottom = '8px';
    fpsDiv.style.right = '10px';
    fpsDiv.style.color = '#0ff';
    fpsDiv.style.fontFamily = 'monospace';
    fpsDiv.style.fontSize = '1.05rem';
    fpsDiv.style.zIndex = 15;
    fpsDiv.style.pointerEvents = 'none';
    fpsDiv.style.textShadow = '0 0 8px #000, 0 0 2px #0ff';
    document.body.appendChild(fpsDiv);
  }

  let lastFpsUpdate = performance.now();
  let frameCount = 0;
  let fps = 0;

  function animate(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    critter.follow(Input.mouse.x, Input.mouse.y);
    // --- Flame at last tail segment ---
    if (lastTailSegment) {
      // Add new particles at the last tail segment
      if (flameParticles.length < 18) {
        let angle = Math.random() * Math.PI * 2;
        let speed = 0.7 + Math.random() * 0.7;
        flameParticles.push({
          x: lastTailSegment.x,
          y: lastTailSegment.y,
          vx: Math.cos(angle) * speed * 0.7,
          vy: -1.2 - Math.random() * 1.2,
          life: 1,
          maxLife: 0.7 + Math.random() * 0.5,
          size: 8 + Math.random() * 8
        });
      }
      // Update and draw particles
      for (let i = flameParticles.length - 1; i >= 0; i--) {
        let p = flameParticles[i];
        p.x += p.vx + (Math.random() - 0.5) * 0.7;
        p.y += p.vy + (Math.random() - 0.5) * 0.7;
        p.vx *= 0.97;
        p.vy += 0.08; // gravity
        p.life -= 0.018 + Math.random() * 0.01;
        // Draw
        ctx.save();
        let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, 'rgba(255,255,255,' + (0.7 * p.life) + ')');
        grad.addColorStop(0.3, 'rgba(255,255,255,' + (0.5 * p.life) + ')');
        grad.addColorStop(0.7, 'rgba(255,255,255,' + (0.3 * p.life) + ')');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.shadowColor = '#ff0';
        ctx.shadowBlur = 48;
        ctx.fill();
        ctx.restore();
        if (p.life <= 0) flameParticles.splice(i, 1);
      }
    }
    frameCount++;
    if (now - lastFpsUpdate > 500) {
      fps = Math.round(1000 * frameCount / (now - lastFpsUpdate));
      lastFpsUpdate = now;
      frameCount = 0;
    }
    fpsDiv.textContent = fps + ' FPS';

    // --- Dynamic background music volume ---
    const audio = document.getElementById('bgMusic');
    if (audio) {
      // Distance from dragon to mouse
      const dx = critter.x - Input.mouse.x;
      const dy = critter.y - Input.mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      // Map distance to volume: close = 0.8, far = 0.15
      const minVol = 0.15, maxVol = 0.8;
      const minDist = 60, maxDist = Math.min(canvas.width, canvas.height) * 0.7;
      let vol = maxVol - (dist - minDist) / (maxDist - minDist) * (maxVol - minVol);
      vol = Math.max(minVol, Math.min(maxVol, vol));
      audio.volume = vol;
    }

    const t = now * 0.002;
    const auraR = 22 + 6 * Math.sin(t * 2);
    ctx.save();
    ctx.globalAlpha = 0.45 + 0.25 * Math.sin(t * 2);
    ctx.beginPath();
    ctx.arc(Input.mouse.x, Input.mouse.y, auraR, 0, 2 * Math.PI);
    ctx.strokeStyle = '#0ff';
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 12; // or 18 for Creature
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
canvas.style.backgroundColor = "black";
canvas.style.zIndex = '1'; // Ensure canvas is below faded text
ctx.strokeStyle = "white";
  //setupSimple();//Just the very basic string
  //setupTentacle();//Tentacle that reaches for mouse
  //setupLizard(.5,100,128);//Literal centipede
  //setupSquid(2,8);//Spidery thing
  var legNum = Math.floor(8 + Math.random() * 5); // 8-12 legs
  var tailLen = Math.floor(60 + Math.random() * 40); // 60-100 tail segments
  setupLizard(
    8 / Math.sqrt(legNum),
    legNum,
    tailLen
  );

// Screen scale (zoom) utility (does not interfere with main logic)
function screenScale() {
  canvas.style.transition = 'transform 0.08s cubic-bezier(0.8,0.1,0.2,1)';
  canvas.style.transform = `scale(${1 + Math.random() * 0.01})`;
  setTimeout(() => {
    canvas.style.transform = 'scale(1)';
  }, 80);
}

// Background music loop. Change The BackGround Music As You Wish
function playBackgroundMusic() {
  const audio = document.getElementById("bgMusic");
  if (audio) {
    audio.loop = true;
    audio.volume = 0.7;
    if (audio.paused) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }
}


window.addEventListener('DOMContentLoaded', playBackgroundMusic);
window.addEventListener('pointerdown', playBackgroundMusic, { once: true });

//Leave A LIke And Follow For More Free Contents
// This script sets up a simple animation of a creature with segments and limbs By MadebyAkshar, Instagram: @ig.madebyakshar// Use This Content For Free
// Do not remove the credits, you can use this code in your projects but do not remove.

