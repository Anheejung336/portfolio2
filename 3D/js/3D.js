$(function () {
    const canvas = document.getElementById("bgCanvas");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(2, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0,
        thickness: 1.0,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        ior: 1.5
    });

    const spheres = [];
    for (let i = 0; i < 6; i++) {
        const geo = new THREE.IcosahedronGeometry(Math.random() * 0.8 + 0.3, 2);
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.set(
            Math.random() * 10 - 5,
            Math.random() * 6 - 3,
            Math.random() * 6 - 3
        );
        scene.add(mesh);
        spheres.push(mesh);

        gsap.to(mesh.position, {
            y: `+=${Math.random() * 1.5 + 0.5}`,
            duration: 3 + Math.random() * 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: Math.random() * 2
        });

        gsap.to(mesh.rotation, {
            y: Math.PI * 2,
            duration: 10 + Math.random() * 3,
            repeat: -1,
            ease: "none"
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});//ready