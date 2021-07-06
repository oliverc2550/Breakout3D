//Ball Class
//Contains properties for movement speed, levelStart bool and Threejs Geometry, Material and Mesh
//Contains methods for reseting the Ball, starting Ball movement and detecting Ball collisions
//Most properties are public so that they can be properly accessed by other functions in the game 
//Due to Javascript syntax if they were set to private they would not have the needed scope
class Ball
{
	constructor()
	{
		this.dx = 0.0025;
		this.dy = 0.0025;
		this.levelStart = false;
		//Property used in conjuction with the multiball powerup
		//this.prime = true;
		this.geometry = new THREE.SphereGeometry(1, 8, 6);
		this.material = new THREE.MeshPhongMaterial({ color: 0xffffff });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = false;
	}
    ResetBall()
	{
		this.dx = 0;
		this.dy = 0;
		this.mesh.geometry = new THREE.SphereGeometry(1, 8, 6);
		this.mesh.position.set(0, 10, 0);
		this.mesh.updateMatrixWorld();
		this.levelStart = true;
	}
    StartBall()
	{
		this.dx = 0.0025;
		this.dy = 0.0025;
		this.levelStart = false;
	}
	//Original collision code from - https://stemkoski.github.io/Three.js/Collision-Detection.html
	//Code modified for use within class using Class keyword, to use face.normal for better collision detection, 
	//and to correctly determine which brick has been hit and it's change properties through the use of parallel arrays
	//Code also makes use of game variables to change their values so they can be properly updated by other bespoke functions
	//Commented out code used for debugging, unless otherwise stated
	Collision()
	{
        if (this.levelStart == false)
		{
			var originPoint = this.mesh.position.clone();
			this.mesh.updateMatrixWorld();

			for (var vertexIndex = 0; vertexIndex < this.mesh.geometry.vertices.length; vertexIndex++)
			{
				this.mesh.updateMatrixWorld();
				var localVertex = this.mesh.geometry.vertices[vertexIndex].clone();
				var globalVertex = localVertex.applyMatrix4(this.mesh.matrix);
				var directionVector = globalVertex.sub(this.mesh.position);

				var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());

				var collisionResults = ray.intersectObjects(collidableMeshList);
				if (this.mesh.position.x < -19 || this.mesh.position.x > 18.5)
				{
					audio.play();
					this.dx = -this.dx;
					this.mesh.updateMatrixWorld();
				}
				if (this.mesh.position.y > 25)
				{
					audio.play();
					this.dy = -this.dy;
					this.mesh.updateMatrixWorld();
				}
				if (this.mesh.position.y < -5 /*&& this.prime == true*/)
				{
					audio.play();
					lives--;
					this.ResetBall();
					this.StartBall();
					this.mesh.updateMatrixWorld();
				}
				//Code Fragment was an attempt to get the multiball powerup to work
				/*else if (this.mesh.position.y < -5 && this.prime == false)
				{
					for (var i = ballList.length - 1; i >= 0; i--)
					{
						var oobBall = ballList.indexOf(this.mesh.uuid);
						console.log(oobBall);
                        if (oobBall !== -1)
						{
							console.log(oobBall);
							ballList.slice(oobBall, 1);
							scene.remove(this.mesh);
                        }
					}
                }*/
				if (collisionResults.length > 0.05 && collisionResults[0].distance < directionVector.length())
				{
					audio.play();
					//console.log(collisionResults[0].object.uuid);
					var collisionFace = collisionResults[0].face.normal;
					if (collisionFace.x <= -0.9 || collisionFace.x >= 0.9)
					{
						//console.log("intersect");
						if (collisionResults[0].object === paddle.mesh)
						{
							this.mesh.position.x = this.mesh.position.x - ((this.dx * 360));
						}
                        else
						{
							this.mesh.position.x = this.mesh.position.x - (this.dx * 180);
                        }
						this.dx = -this.dx;
						this.mesh.updateMatrixWorld();
					}
					//var intersectDistance = collisionResults[0].distance - directionVector.length()
					//console.log("intersect");
					//console.log(intersectDistance);
					this.mesh.position.y = this.mesh.position.y - (this.dy * 180);
					this.dy = -this.dy;

					if (collisionResults[0].object !== paddle.mesh)
					{
						//var collidedBrickInfo = brickList.find(brick => brick.mesh.uuid === collisionResults[0].object.uuid);
						var collidedBrick = brickList.findIndex(brick => brick.mesh.uuid === collisionResults[0].object.uuid);
						//console.log(collidedBrickInfo);
						//console.log(collidedBrick);
						brickList[collidedBrick].ReduceHealth();
						score++;
						if (brickList[collidedBrick].health < 0)
						{
							scene.remove(brickList[collidedBrick].mesh);
							brickList[collidedBrick].PowerUpSpawn();
							brickList.splice(collidedBrick, 1);
							collidableMeshList.splice(collidedBrick, 1);
							score++ * 2;
						}
					}
					this.mesh.updateMatrixWorld();
				}
				this.mesh.position.x += this.dx;
				this.mesh.position.y += this.dy;
				this.mesh.updateMatrixWorld();
			}
        }
	}
}