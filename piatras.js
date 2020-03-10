var config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "game-container",
      width: 1200,
      height: 800
    },
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  var game = new Phaser.Game(config);
  var player;
  var cursors;
  var pointer;

  function preload() {
    // Sprite sheet create by user Kenny at https://opengameart.org/content/fish-pack-0
    this.load.atlasXML("sprites", "assets/fishSpritesheet.png", "assets/fishSpritesheet.xml");

    //create a dark blue to light blue gradient for background
    var texture = this.textures.createCanvas('ocean_backdrop', game.config.width, game.config.height);
    var context = texture.getContext();
    var grd = context.createLinearGradient(game.config.width / 2, game.config.height, game.config.width / 2, 0);
    grd.addColorStop(0, '#0000FF');
    grd.addColorStop(1, '#9999FF');
    context.fillStyle = grd;
    context.fillRect(0, 0, game.config.width, game.config.height);
    texture.refresh(); //texture will not show without this
  }

  function create() {
    this.add.image(game.config.width / 2, game.config.height / 2, 'ocean_backdrop');

    player = this.physics.add.sprite(game.config.width / 6, game.config.height / 2, 'sprites', 'fishTile_078.png');
    player.body.drag = new Phaser.Math.Vector2(player_drag, player_drag);
    player.body.useDamping = true;
    player.body.setMaxVelocity(player_max_speed, player_max_speed);
    cursors = this.input.keyboard.createCursorKeys();

    //Point 0 is the mouse. Pointer 1 is touch, if available
    if(this.input.manager.pointersTotal > 1)
      pointer = this.input.manager.pointers[1];
    else
      pointer = this.input.manager.pointers[0];
  }

  function update(){
    doPlayerControls();
    doPlayerWorldBoundsCollisions();
  }

  const player_max_speed = 800;
  const player_max_accel = 1000;
  const player_touch_min_distance = 200; // min distance a touch must be from player before player moves
  const player_drag = 0.95;

  function doPlayerControls(){
    if(!pointer.isDown){
      if (cursors.left.isDown) {
          player.setAccelerationX(-1 * player_max_accel);
      } else if (cursors.right.isDown) {
          player.setAccelerationX(player_max_accel);
      } else {
          player.setAccelerationX(0);
      }

      if (cursors.up.isDown) {
        player.setAccelerationY(-1 * player_max_accel);
      } else if (cursors.down.isDown) {
          player.setAccelerationY(player_max_accel);
      } else {
          player.setAccelerationY(0);
      }
    }else{
      var pointer_vec = new Phaser.Math.Vector2(pointer.x - player.body.position.x, pointer.y - player.body.position.y);
      var dist = pointer_vec.length();
      pointer_vec.normalize(); // going to use this for direction of acceleration
      // if player fish is too close to touch position then set acceleration to zero. This stops the fish from
      // 'orbiting' the touch position
      if (dist > player_touch_min_distance)
        player.setAcceleration(pointer_vec.x * player_max_accel, pointer_vec.y * player_max_accel );
      else
        player.setAcceleration(0, 0);
    }
  }

  function doPlayerWorldBoundsCollisions(){
    // Wrap player around the x-axis if they go off screen
    if(player.body.position.x > game.config.width){
      player.setX(0 - (player.body.width / 2));
    }else if(player.body.position.x < -player.body.width){
      player.setX(game.config.width);
    }

    // Stop player at top or bottom and give a little bounce the other way
    if(player.body.position.y < 0){
      player.setVelocityY(0);
      player.setAccelerationY(player_max_accel);
    }else if(player.body.position.y > game.config.height - player.body.height){
      player.setVelocityY(0);
      player.setAccelerationY(-1 * player_max_accel);
    }
  }
