import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ASScroll from '@ashthornton/asscroll'

import Experience from "../Experience";


export default class Controls {

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.rectAreaLights = [];
        this.room.children.forEach((child) => {
            if (child.type === "RectAreaLight") {
                this.rectAreaLights.push(child);
            }
        });
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;

        GSAP.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";

        this.setSmoothScroll();
        this.setScrollTrigger();
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.3,
            disableRaf: true
        });


        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement
        });


        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            fixedMarkers: true
        });


        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(".gsap-marker-start, .gsap-marker-end, [asscroll]")
            });

        });
        return asscroll;
    }

    setSmoothScroll() {
        this.asscroll = this.setupASScroll();
    }

    setScrollTrigger() {
        let mm = GSAP.matchMedia();

        /* --------------------------------------------------------------- Desktop Setup Code Here --------------------------------------------------------------- */

        mm.add("(min-width: 969px)", () => {

            // Resets
            this.room.scale.set(0.1, 0.1, 0.1);
            this.room.position.set(0, 0, 0);
            this.rectAreaLights[2].width = 1.2;
            this.rectAreaLights[2].height = 0.37;

            /* -------------------- First Section -------------------- */

            this.firstMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".first-move",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(this.room.position,
                {
                    x: () => {
                        return this.sizes.width * 0.0013;
                    }
                }
            );

            /* ------------------- Second Section ------------------- */

            this.secondMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".second-move",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(
                this.room.position,
                {
                    x: () => {
                        return 2;
                    },

                    z: () => {
                        return this.sizes.height * 0.003;
                    }
                },
                "same"
            ).to(
                this.room.scale,
                {
                    x: 0.35,
                    y: 0.35,
                    z: 0.35,
                },
                "same"
            ).to(
                this.rectAreaLights[2],
                {
                    width: 1.2 * 4,
                    height: 0.37 * 4,
                },
                "same"
            );

            /* ------------------- Third Section ------------------- */

            this.thirdMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".third-move",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(this.camera.orthographicCamera.position,
                {
                    x: -2.5,
                    y: -0.5,
                }
            );
        });

        /* --------------------------------------------------------------- Mobile Setup Code Here --------------------------------------------------------------- */

        mm.add("(max-width: 968px)", () => {

            // Resets
            this.room.scale.set(0.05, 0.05, 0.05);
            this.room.position.set(0, 0, 0);
            this.rectAreaLights[2].width = 0.6;
            this.rectAreaLights[2].height = 0.2;

            /* -------------------- First Section -------------------- */

            this.firstMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".first-move",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(this.room.scale,
                {
                    x: 0.1,
                    y: 0.1,
                    z: 0.1,
                },
                "same"
            ).to(
                this.rectAreaLights[2],
                {
                    width: 0.9 * 1.4,
                    height: 0.27 * 1.4,
                },
                "same"
            );

            /* ------------------- Second Section ------------------- */

            this.secondMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".second-move",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(this.room.position,
                {
                    x: 2,
                    z: 1,
                },
                "same"
            ).to(this.room.scale,
                {
                    x: 0.25,
                    y: 0.25,
                    z: 0.25,
                },
                "same"
            ).to(
                this.rectAreaLights[2],
                {
                    width: 0.9 * 3.4,
                    height: 0.27 * 3.4,
                },
                "same"
            );

            /* ------------------- Third Section ------------------- */

            this.thirdMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".third-move",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(this.camera.orthographicCamera.position,
                {
                    y: 1.5,
                    x: 0.5,
                }
            );
        });

        /* ---------------------------------------------------- Setup Code For Both Desktop And Mobile Here ---------------------------------------------------- */

        mm.add("", () => {

            // Progress Bars Animations

            this.section = document.querySelectorAll(".section");

            this.section.forEach((section) => {
                this.progressWrapper = section.querySelector(".progress-wrapper");
                this.progressBar = section.querySelector(".progress-bar");

                if (section.classList.contains("right")) {
                    GSAP.to(section, {
                        borderTopLeftRadius: 10,
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",
                            end: "top top",
                            scrub: 0.6,
                        },
                    });

                    GSAP.to(section, {
                        borderBottomLeftRadius: 700,
                        scrollTrigger: {
                            trigger: section,
                            start: "bottom bottom",
                            end: "bottom top",
                            scrub: 0.6,
                        },
                    });
                } else if (section.classList.contains("left")) {
                    GSAP.to(section, {
                        borderTopRightRadius: 10,
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",
                            end: "top top",
                            scrub: 0.6,
                        },
                    });

                    GSAP.to(section, {
                        borderBottomRightRadius: 700,
                        scrollTrigger: {
                            trigger: section,
                            start: "bottom bottom",
                            end: "bottom top",
                            scrub: 0.6,
                        },
                    });
                }

                GSAP.from(this.progressBar, {
                    scaleY: 0,
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.4,
                        pin: this.progressWrapper,
                        pinSpacing: false,
                    }
                });
            });

            // Circle Animations

            /* ------------------- First Section ------------------- */

            this.firstMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".first-move",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(this.circleFirst.scale,
                {
                    x: 3,
                    y: 3,
                    z: 3,
                }
            );

            /* ------------------- Second Section ------------------- */

            this.secondMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".second-move",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(
                this.circleSecond.scale,
                {
                    x: 3,
                    y: 3,
                    z: 3,
                },
                "same"
            ).to(
                this.room.position,
                {
                    y: 0.7,
                },
                "same"
            );

            /* ------------------- Third Section ------------------- */

            this.thirdMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".third-move",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(this.circleThird.scale,
                {
                    x: 3,
                    y: 3,
                    z: 3,
                }
            );

            // Mini Platform Animations

            this.secondPartTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".third-move",
                    start: "center center",
                }
            })

            this.room.children.forEach(child => {
                if (child.name === "Mini_Floor") {
                    this.first = GSAP.to(child.position, {
                        x: -6.57607,
                        z: 14.4764,
                        duration: 0.3,
                    });
                }

                if (child.name === "Mail_Box") {
                    this.second = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.3,
                    });
                }

                if (child.name === "Lamp") {
                    this.third = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.3,
                    });
                }

                if (child.name === "Tile") {
                    this.fourth = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.3,
                    });
                }

                if (child.name === "Tile001") {
                    this.fifth = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.3,
                    });
                }

                if (child.name === "Tile002") {
                    this.sixth = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.3,
                    });
                }

                if (child.name === "Soil") {
                    this.seventh = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.3,
                    });
                }

                if (child.name === "Flower") {
                    this.eighth = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.3,
                    });
                }

                if (child.name === "Flower002") {
                    this.ninth = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.3,
                    });
                }
            });

            this.secondPartTimeline.add(this.first);
            this.secondPartTimeline.add(this.second);
            this.secondPartTimeline.add(this.third, "same");
            this.secondPartTimeline.to(
                this.rectAreaLights[0],
                {
                    width: 0.01 * 4,
                    height: 0.01 * 4,
                },
                "same"
            ).to(
                this.rectAreaLights[1],
                {
                    width: 0.01 * 4,
                    height: 0.01 * 4,
                },
                "same"
            )
            this.secondPartTimeline.add(this.fourth, "-=0.2");
            this.secondPartTimeline.add(this.fifth, "-=0.2");
            this.secondPartTimeline.add(this.sixth, "-=0.2");
            this.secondPartTimeline.add(this.seventh, "-=0.2");
            this.secondPartTimeline.add(this.eighth);
            this.secondPartTimeline.add(this.ninth, "-=0.1");
        });
    }

    resize() {

    }

    update() {

    }

}