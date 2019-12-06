var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
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
   
  const player_max_speed = 500;
  const player_max_accel = 1000;
  var game = new Phaser.Game(config);
  var player;
  var cursors;

  function preload() {
    // Sprite sheet create by user Kenny at https://opengameart.org/content/fish-pack-0
    this.load.atlasXML("sprites", "assets/fishSpritesheet.png", "assets/fishSpritesheet.xml");
    
    //create a dark blue to light blue gradient for background
    var texture = this.textures.createCanvas('ocean_backdrop', 800, 600);
    var context = texture.getContext();
    var grd = context.createLinearGradient(game.config.width / 2, game.config.height, game.config.width / 2, 0);
    grd.addColorStop(0, '#0000FF');
    grd.addColorStop(1, '#9999FF');
    context.fillStyle = grd;
    context.fillRect(0, 0, game.config.width, game.config.height);
    texture.refresh(); //texture will not show without this
  }
   
  function create() {
    this.add.image(400, 300, 'ocean_backdrop');

    player = this.physics.add.sprite(100, 300, 'sprites', 'fishTile_078.png');
    //player.setCollideWorldBounds(true);
    player.body.drag = new Phaser.Math.Vector2(0.98, 0.98);
    player.body.useDamping = true;
    player.body.setMaxVelocity(player_max_speed, player_max_speed);
    cursors = this.input.keyboard.createCursorKeys();
  }

  function update(){
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
    
    // handle collision with world bounds manually, as player.setCollideWorldBounds
    // does not allow us to wrap the player around the x axis
    if(player.body.position.x > game.config.width){
      player.setX(0 - (player.body.width / 2));
    }else if(player.body.position.x < -player.body.width){
      player.setX(game.config.width);
    }

    //clamping player.body.position to 0 or game.config.height seems to stick the player to the top or bottom,
    //but zeroing the velocity and reversing acceleration seems to work.
    if(player.body.position.y < 0){
      player.setVelocityY(0);
      player.setAccelerationY(player_max_accel);   
    }else if(player.body.position.y > game.config.height - player.body.height){
      player.setVelocityY(0);
      player.setAccelerationY(-1 * player_max_accel);   
    }


  }