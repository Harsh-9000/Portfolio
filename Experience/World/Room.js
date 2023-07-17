import * as THREE from "three";
import GSAP from "gsap"
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";
import Experience from "../Experience";

export default class Room {

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1
        }

        this.setModel();
        this.onMouseMove();
    }

    setModel() {

        const texture = new THREE.CanvasTexture(new FlakesTexture());
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        const repeatX = 10;
        const repeatY = 6;
        texture.repeat.set(repeatX, repeatY);

        const shineMaterial = new THREE.MeshPhysicalMaterial({
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            metalness: 0.9,
            roughness: 0.5,
            color: 0xe7e7e7,
            normalMap: texture,
            normalScale: new THREE.Vector2(0.15, 0.15)
        });

        const shineMaterialBlack = new THREE.MeshPhysicalMaterial({
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            metalness: 0.9,
            roughness: 0.5,
            color: 0x00000,
            normalMap: texture,
            normalScale: new THREE.Vector2(0.15, 0.15)
        });

        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Group) {
                const childCount = child.children.length;
                for (let i = 0; i < childCount; i++) {
                    const groupChild = child.children[i];

                    groupChild.castShadow = true;
                    groupChild.receiveShadow = true;

                    if (groupChild.name === "Cylinder008" || groupChild.name === "Cylinder007" || groupChild.name === "Cylinder010") {
                        groupChild.material = shineMaterial;
                    }

                    if (groupChild.name === "Cylinder008_1") {
                        groupChild.material = shineMaterialBlack;
                    }
                }
            }

            if (child.name === "Lamp") {
                child.children[0].material = new THREE.MeshPhysicalMaterial();
                child.children[0].material.roughness = 0;
                child.children[0].material.color.set(0xffffff);
                child.children[0].material.emissive.set(0xffffff);
                child.children[0].material.ior = 3;
                child.children[0].material.transmission = 1;
                child.children[0].material.opacity = 1;
            }

            if (child.name === "Computer") {
                child.children[0].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }

            if (child.name === "Mini_Floor") {
                child.position.x = -2.93763;
                child.position.z = 10.838;
            }

            child.scale.set(0, 0, 0);

            if (child.name === "Cube001") {
                child.position.set(0, -1.5, 0);
                child.rotation.y = Math.PI / 4;
            }

            this.roomChildren[child.name.toLowerCase()] = child;
        });

        const widthOne = 0.001;
        const heightOne = 0.001;
        const intensityOne = 45;

        const widthTwo = 1.2;
        const heightTwo = 0.37;
        const intensityTwo = 1;

        const rectLightOne = new THREE.RectAreaLight(0xffffff, intensityOne, widthOne, heightOne);
        rectLightOne.position.set(-7.34607, 0.529847, 11.3346);
        rectLightOne.rotation.set(0, 0, 0);

        const rectLightTwo = new THREE.RectAreaLight(0xffffff, intensityOne, widthOne, heightOne);
        rectLightTwo.position.set(-7.34607, 0.529847, 11.3340);
        rectLightTwo.rotation.set(0, Math.PI, 0);

        const rectLightThree = new THREE.RectAreaLight(0xffffff, intensityTwo, widthTwo, heightTwo);
        rectLightThree.position.set(4.97901, 9.59, -7.44416);
        rectLightThree.rotation.set(Math.PI / 11, -Math.PI / 4, 0);

        this.actualRoom.add(rectLightOne);
        this.actualRoom.add(rectLightTwo);
        this.actualRoom.add(rectLightThree);

        this.roomChildren["rectLightOne"] = rectLightOne;
        this.roomChildren["rectLightTwo"] = rectLightTwo;
        this.roomChildren["rectLightThree"] = rectLightThree;

        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.1, 0.1, 0.1);
    }

    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.rotation = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            this.lerp.target = this.rotation * 0.1;
        });
    }

    resize() {

    }

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualRoom.rotation.y = this.lerp.current;
    }

} 