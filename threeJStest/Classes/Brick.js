//Brick Class
//Contains properties for brick health, X and Y position, random number used to determine if the brick spawns a powerup, and Threejs Geometry, Material, and Mesh
//Contains methods for reducing brick health if hit (called in ball collision) and spawning a powerup
//Most properties are public so that they can be properly accessed by other functions in the game 
//Due to Javascript syntax if they were set to private they would not have the needed scope
class Brick
{
    constructor(Health, X, Y)
    {
        this.health = Health;
        this.x = X;
        this.y = Y;
        this.rand = Math.floor(Math.random() * 2);
        this.materialList = [
            new THREE.MeshPhongMaterial({ color: 0xff0000 }),
            new THREE.MeshPhongMaterial({ color: 0xff8000 }),
            new THREE.MeshPhongMaterial({ color: 0xffff00 }),
            new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
            new THREE.MeshPhongMaterial({ color: 0x0000ff }),
            new THREE.MeshPhongMaterial({ color: 0x9900cc })
        ];
        var geometry = new THREE.BoxGeometry(5, 1, 1);
        this.mesh = new THREE.Mesh(geometry, this.materialList[this.health]);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = false;
    }
    ReduceHealth()
    {
        if (unbreakable == false)
        {
            this.health--;
            this.mesh.material = this.materialList[this.health];
        }
    }
    PowerUpSpawn()
    {
        if (this.rand === 1)
        {
            var powerUp = new PowerUp();
            powerUpList.push(powerUp);
            powerUp.mesh.position.set(this.x, this.y, 0);
            scene.add(powerUp.mesh);
            powerUp.isFalling = true;
        }
    }
}