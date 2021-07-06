//Background Class
//Contains properties for Threejs Geometry, Material and Mesh
//Contains no methods
//Most properties are public so that they can be properly accessed by other functions in the game 
//Due to Javascript syntax if they were set to private they would not have the needed scope
class Background
{
    constructor()
    {
        var geometry = new THREE.PlaneGeometry(75, 60, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0x97979b });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = true;
    }
}