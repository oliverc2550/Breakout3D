//Ball Class
//Contains properties for isFalling bool, random number to determine the powerup effect, effectText used to create a new spriteText obj and Threejs Geometry, Material and Mesh
//Contains methods for causing the powerup to fall down the screen and for determining and the activating the assigned powerup effect (switch statement used to simplify this)
//Async functions used within the PowerupEffect method to allow some powerups to be temporary, and to briefly display a UI indicator of what powerup effect has been activated
//Most properties are public so that they can be properly accessed by other functions in the game 
//Due to Javascript syntax if they were set to private they would not have the needed scope
class PowerUp
{
    constructor()
    {
        this.isFalling = false;
        this.rand = Math.floor(Math.random() * 11);
        this.effectText;
        this.materialList = [
            new THREE.MeshPhongMaterial({ color: 0xff0000 }),
            new THREE.MeshPhongMaterial({ color: 0xff8000 }),
            new THREE.MeshPhongMaterial({ color: 0xffff00 }),
            new THREE.MeshPhongMaterial({ color: 0xcc9900 }),
            new THREE.MeshPhongMaterial({ color: 0x009900 }),
            new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
            new THREE.MeshPhongMaterial({ color: 0x003399 }),
            new THREE.MeshPhongMaterial({ color: 0x0000ff }),
            new THREE.MeshPhongMaterial({ color: 0x9900cc }),
            new THREE.MeshPhongMaterial({ color: 0xff66cc }),
            new THREE.MeshPhongMaterial({ color: 0x996633 })
        ];
        var geometry = new THREE.CubeGeometry(0.5, 0.5, 0.5);
        this.mesh = new THREE.Mesh(geometry, this.materialList[this.rand]);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = false;
    }
    PowerUpFall()
    {
        if (this.isFalling === true)
        {
            var fallingSpeed = -0.045;
            var rotationSpeed = 0.035
            this.mesh.position.y += fallingSpeed;
            this.mesh.rotation.y += rotationSpeed;
        }
    }
    PowerUpEffect()
    {
        var effectText;
        switch (this.rand)
        {
            case 0:
                //Larger Paddle;
                    effectText = new SpriteText("Large Paddle", new THREE.Vector3(-3, 10, 0));
                    paddle.mesh.geometry = new THREE.BoxGeometry(10, 1, 1);
                    paddle.mesh.updateMatrixWorld();
                    async function EffectTextDisplay()
                    {
                        scene.add(effectText);
                        let delay = await WaitDelay(2000);
                        scene.remove(effectText);
                    }
                    EffectTextDisplay();
                    break;
            case 1:
                //Smaller Paddle;
                    effectText = new SpriteText("Small Paddle", new THREE.Vector3(-3, 10, 0));
                    paddle.mesh.geometry = new THREE.BoxGeometry(2.5, 1, 1);
                    paddle.mesh.updateMatrixWorld();
                    EffectTextDisplay();
                    break;
            case 2:
                //Larger Ball;
                    effectText = new SpriteText("Large Ball", new THREE.Vector3(-3, 10, 0));
                    ballPrime.mesh.geometry = new THREE.SphereGeometry(1.5, 8, 6);
                    ballPrime.mesh.updateMatrixWorld();
                    EffectTextDisplay();
                    break;
            case 3:
                //Smaller Ball;
                    effectText = new SpriteText("Small Ball", new THREE.Vector3(-3, 10, 0));
                    ballPrime.mesh.geometry = new THREE.SphereGeometry(0.5, 8, 6);
                    ballPrime.mesh.updateMatrixWorld();
                    EffectTextDisplay();
                    break;
            case 4:
                //Slow Ball;
                    effectText = new SpriteText("Slow Ball", new THREE.Vector3(-3, 10, 0));
                    async function SlowBall()
                    {
                        ballPrime.dx = ballPrime.dx / 2;
                        ballPrime.dy = ballPrime.dy / 2;
                        let delay = await WaitDelay(10000);
                        ballPrime.dx = ballPrime.dx * 2;
                        ballPrime.dy = ballPrime.dy * 2;
                    }
                    SlowBall();
                    EffectTextDisplay();
                    break;
            case 5:
                //1 Hit Brick Destroy;
                    effectText = new SpriteText("1 Hit Brick Break", new THREE.Vector3(-3, 10, 0));
                    for (var i = 0; i < brickList.length; i++)
                    {
                        brickList[i].health = 0;
                    }
                    EffectTextDisplay();
                    break;
            case 6:
                //Random Brick Health;
                    effectText = new SpriteText("Random Brick Health", new THREE.Vector3(-3, 10, 0));
                    for (var i = 0; i < brickList.length; i++)
                    {
                        var randHealth = 0;
                        randHealth = Math.floor(Math.random() * brickList[i].materialList.length);
                        brickList[i].health = randHealth;
                        brickList[i].mesh.material = brickList[i].materialList[randHealth];
                    }
                    EffectTextDisplay();
                    break;
            case 7:
                //Unbreakable Bricks;
                    effectText = new SpriteText("Unbreakable Bricks", new THREE.Vector3(-3, 10, 0));
                    async function Unbreakable()
                    {
                        unbreakable = true;
                        let delay = await WaitDelay(15000);
                        unbreakable = false;
                    }
                    Unbreakable();
                    EffectTextDisplay();
                    break;
            case 8:
                //Fog;
                effectText = new SpriteText("Fog", new THREE.Vector3(-1, 10, 8), { fontColor: 'rgba(0, 0, 0, 1)', });
                    async function Fog()
                    {
                        var fog = new THREE.Fog(0xffffff, 0.1, 20);
                        scene.fog = fog;
                        let delay = await WaitDelay(16000);
                        scene.fog = null;
                    }
                    EffectTextDisplay();
                    Fog();
                    break;
            case 9:
                //Extra Life;
                    effectText = new SpriteText("Extra Life", new THREE.Vector3(-3, 10, 0));
                    lives++;
                    EffectTextDisplay();
                    break;
            case 10:
                //Double Points;
                    effectText = new SpriteText("Double Points", new THREE.Vector3(-3, 10, 0));
                    scoreMultiplier = 2;
                    EffectTextDisplay();
                    break;
            //Geometry Change powerups for the ball and paddle, MultiBall, and Ball Trap commented out to to issues getting them to function properly.
            //Geometry Change effects caused issues with collision and no satisfactory solution could be found, in order to preserve gameplay these were removed from the final game
            //MultiBall and Ball Trap issues were due to being unable to find a satisfactory way to correctly find and remove the added elements from their respective arrays
            //The use of the Class keyword paired with Threejs componded this issue and not solution was found before project deadline
            //Code remains to show attempts to get these powerups functional
            //case 5:
            //    //Change Paddle Geometry;
            //    effectText = new SpriteText("New Paddle Shape", new THREE.Vector3(-3, 10, 0));
            //    var paddleGeometryList = [
            //        new THREE.ConeGeometry(3, 1, 8, 1),
            //        new THREE.CylinderGeometry(1, 1, 5, 8, 1),
            //        new THREE.BoxGeometry(1, 4, 1)
            //
            //    ];
            //    var randPadGeo = Math.floor(Math.random() * paddleGeometryList.length);
            //    paddle.mesh.geometry = paddleGeometryList[randPadGeo];
            //    paddle.mesh.updateMatrixWorld();
            //    EffectTextDisplay();
            //    break;
            //case 6:
            //    //Change Ball Geometry;
            //    effectText = new SpriteText("New Ball Shape", new THREE.Vector3(-3, 10, 0));
            //    var ballGeometryList = [
            //        new THREE.IcosahedronGeometry(1, 0),
            //        new THREE.TetrahedronGeometry(1, 0),
            //
            //    ];
            //    var randBallGeo = Math.floor(Math.random() * ballGeometryList.length);
            //    ballPrime.mesh.geometry = ballGeometryList[randBallGeo];
            //    ballPrime.mesh.updateMatrixWorld();
            //    switch (randBallGeo)
            //    {
            //        case 0:
            //            ballPrime.dx = 0.02;
            //            ballPrime.dy = 0.02;
            //            break;
            //        case 1:
            //            ballPrime.dx = 0.02;
            //            ballPrime.dy = 0.02;
            //            break;
            //    }
            //    EffectTextDisplay();
            //    break;
            //case 9:
            //    //MultiBall;
            //    var randBalls = Math.floor(Math.random() * 3) + 1;
            //    effectText = new SpriteText(randBalls + " Extra Balls", new THREE.Vector3(-3, 10, 0));
            //    for (var i = 0; i < randBalls; i++)
            //    {
            //        var ball = new Ball();
            //        ball.mesh.material = new THREE.MeshPhongMaterial({ color: 0x000000 });
            //        ball.mesh.position.set(i, 10, 0);
            //        ball.prime = false;
            //        ballList.push(ball);
            //        scene.add(ballList[i].mesh);
            //    }
            //    EffectTextDisplay();
            //    break;
            //case 10:
            //    //Ball Trap;
            //    effectText = new SpriteText("Ball Trap", new THREE.Vector3(-3, 10, 0));
            //    async function BallTrap()
            //    {
            //        var trap = new THREE.Mesh(new THREE.BoxGeometry(38, 1, 1), new THREE.MeshPhongMaterial({ color: 0x993300 }));
            //        trap.position.set(-2, 12, 0);
            //        collidableMeshList.push(trap);
            //        scene.add(trap);
            //        ballPrime.mesh.position.set(0, 13.5, 0);
            //        let delay = await TimeDelay(10000);
            //        var findPowerUpEffect = collidableMeshList.findIndex(trap => trap.uuid === trap.uuid);
            //        collidableMeshList.splice(findPowerUpEffect, 1);
            //        scene.remove(trap);
            //    }
            //    BallTrap();
            //    EffectTextDisplay();
            //    break;
        }
    }
}
