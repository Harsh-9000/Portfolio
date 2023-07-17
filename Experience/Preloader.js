import EventEmitter from "events";
import GSAP from "gsap";

import Experience from "./Experience";

import convert from "./Utils/convertDivsToSpans";

export default class Preloader extends EventEmitter {

    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.world = this.experience.world;
        this.device = this.sizes.device;

        this.sizes.on("switchdevice", (device) => {
            this.device = device;
        });

        this.world.on("worldready", () => {
            this.setAssets();
            this.playIntro();
        });

    }

    setAssets() {
        convert(document.querySelector(".credit"));
        convert(document.querySelector(".intro-text"));
        convert(document.querySelector(".hero-main-title"));
        convert(document.querySelector(".hero-main-description"));
        convert(document.querySelector(".first-sub"));
        convert(document.querySelector(".second-sub"));
        this.room = this.experience.world.room.actualRoom;
        this.roomChildren = this.experience.world.room.roomChildren;
        console.log(this.roomChildren);
    }

    onScroll(e) {
        if (e.deltaY > 0) {
            this.removeEventListeners();
            this.playSecondIntro();
        }
    }

    onTouch(e) {
        this.initialY = e.touches[0].clientY;
    }

    onTouchMove(e) {
        let currentY = e.touches[0].clientY;
        let difference = this.initialY - currentY;
        if (difference > 0) {
            this.removeEventListeners();
            this.playSecondIntro();
        }
        this.initialY = null;
    }

    removeEventListeners() {
        window.removeEventListener("wheel", this.scrollOnceEvent);
        window.removeEventListener("touchstart", this.touchStart);
        window.removeEventListener("touchmove", this.touchMove);
    }

    async playIntro() {
        this.scaleFlag = true;
        await this.firstIntro();
        this.moveFlag = true;

        this.scrollOnceEvent = this.onScroll.bind(this);
        this.touchStart = this.onTouch.bind(this);
        this.touchMove = this.onTouchMove.bind(this);

        window.addEventListener("wheel", this.scrollOnceEvent);
        window.addEventListener("touchstart", this.touchStart);
        window.addEventListener("touchmove", this.touchMove);
    }

    async playSecondIntro() {
        this.moveFlag = false;
        await this.secondIntro();
        this.scaleFlag = false;
        this.emit("enablecontrols");
    }

    firstIntro() {

        return new Promise((resolve) => {
            this.firstTimeline = new GSAP.timeline();
            this.firstTimeline.set(".animatedis", { y: 0, yPercent: 100 });
            this.firstTimeline.to(".preloader", {
                opacity: 0,
                delay: 1,
                onComplete: () => {
                    document.querySelector(".preloader").classList.add("hidden");
                }
            });

            if (this.device === "desktop") {

                this.firstTimeline.to(this.roomChildren.cube001.scale, {
                    x: 1.2,
                    y: 1.2,
                    z: 1.2,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                }).to(
                    this.room.position, {
                    x: -0.8,
                    ease: "power1.out",
                    duration: 0.7,
                });

            } else if (this.device === "mobile") {

                this.firstTimeline.to(this.roomChildren.cube001.scale, {
                    x: 1.2,
                    y: 1.2,
                    z: 1.2,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                }).to(
                    this.room.position, {
                    z: -0.5,
                    ease: "power1.out",
                    duration: 0.7,
                });

            }

            this.firstTimeline.to(".intro-text .animatedis", {
                yPercent: 0,
                stagger: 0.05,
                ease: "back.out(1.7)",
            }).to(".credit .animatedis", {
                yPercent: 0,
                stagger: 0.05,
                ease: "back.out(1.7)",
            },
                "same"
            ).to(".arrow-svg-wrapper", {
                opacity: 1,
            },
                "same"
            ).to(".toggle-bar", {
                opacity: 1,
                onComplete: resolve,
            },
                "same"
            );

        });

    }

    secondIntro() {

        return new Promise((resolve) => {
            this.secondTimeline = new GSAP.timeline();
            this.secondTimeline.to(".intro-text .animatedis", {
                yPercent: 100,
                stagger: 0.05,
                ease: "back.in(1.7)",
            },
                "fadeout"
            ).to(".credit .animatedis", {
                yPercent: 100,
                stagger: 0.05,
                ease: "back.in(1.7)",
            },
                "fadeout"
            ).to(".arrow-svg-wrapper", {
                opacity: 0,
            },
                "fadeout"
            ).to(
                this.room.position, {
                x: 0,
                y: 0,
                z: 0,
                ease: "power1.out",
            },
                "same"
            ).to(
                this.roomChildren.cube001.rotation, {
                y: 2 * Math.PI + Math.PI / 4,
            },
                "same"
            ).to(
                this.roomChildren.cube001.scale, {
                x: 10,
                y: 10,
                z: 10,
            },
                "same"
            ).to(
                this.camera.orthographicCamera.position, {
                y: 3.7,
            },
                "same"
            ).to(
                this.roomChildren.cube001.position, {
                x: 0,
                y: 8.00135,
                z: 0,
            },
                "same"
            ).set(
                this.roomChildren.room.scale, {
                x: 1,
                y: 1,
                z: 1,
            }).to(
                this.roomChildren.cube001.scale, {
                x: 0,
                y: 0,
                z: 0,
            },
                "introtext"
            ).to(".hero-main-title .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            },
                "introtext"
            ).to(".hero-main-description .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            },
                "introtext"
            ).to(".first-sub .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            },
                "introtext"
            ).to(".second-sub .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            },
                "introtext"
            ).to(
                this.roomChildren.floor.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.5,
            },
                ">-0.5"
            ).to(
                this.roomChildren.floor_trim.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.5,
            },
                ">-0.4"
            ).to(
                this.roomChildren.wardrobe.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.3"
            ).to(
                this.roomChildren.dumbbells.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.3"
            ).to(
                this.roomChildren.wall_stuff.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.3"
            ).to(
                this.roomChildren.bed.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.4"
            ).to(
                this.roomChildren.pillows.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.3"
            ).to(
                this.roomChildren.table.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.4"
            ).to(
                this.roomChildren.table_extras.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.3"
            ).to(
                this.roomChildren.table_stuff.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.3"
            ).to(
                this.roomChildren.computer.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.3"
            ).to(
                this.roomChildren.shelves.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.3"
            ).to(
                this.roomChildren.chair_stand.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.3"
            ).to(
                this.roomChildren.mat.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.3"
            ).to(
                this.roomChildren.coffee_table.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            }).to(
                this.roomChildren.dishes.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.1"
            ).to(
                this.roomChildren.chocolate_donut.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.1"
            ).to(
                this.roomChildren.strawberry_donut.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                ">-0.1"
            ).to(
                this.roomChildren.chair.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                duration: 0.5,
            },
                "chair"
            ).to(
                this.roomChildren.chair.rotation, {
                y: 2 * Math.PI + 7 * Math.PI / 4,
                ease: "power1.out",
                duration: 1,
            },
                "chair"
            ).to(
                this.roomChildren.mini_floor.scale, {
                x: 1,
                y: 1,
                z: 1,
            },
                ">-0.1"
            ).to(".arrow-svg-wrapper", {
                opacity: 1,
                onComplete: resolve,
            });
        });

    }

    move() {
        if (this.device === "desktop") {
            this.room.position.set(-0.8, 0, 0);
        } else {
            this.room.position.set(0, 0, -0.5);
        }
    }

    scale() {
        this.roomChildren.rectLightOne.width = 0;
        this.roomChildren.rectLightOne.height = 0;

        this.roomChildren.rectLightTwo.width = 0;
        this.roomChildren.rectLightTwo.height = 0;

        this.roomChildren.rectLightThree.width = 0;
        this.roomChildren.rectLightThree.height = 0;


        if (this.device === "desktop") {
            this.room.scale.set(0.1, 0.1, 0.1);
        } else {
            this.room.scale.set(0.05, 0.05, 0.05);
        }
    }

    update() {

        if (this.moveFlag) {
            this.move();
        }

        if (this.scaleFlag) {
            this.scale();
        }

    }

}