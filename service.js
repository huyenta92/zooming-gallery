
gsap.registerPlugin(ScrollTrigger);

function changeBackground() {
  let allThumb = document.querySelectorAll(".hero_images .thumb");
  let sections = document.querySelectorAll(".service-sec");
  let bgCover = document.querySelectorAll(".bg-cover");
  let headings = gsap.utils.toArray(".content");
  let currentIndex = -1;
  let thumbIdx = -1;
  let wrap = gsap.utils.wrap(0, sections.length)
  let animating;
  let animatingGal;
  let count = 3
  let options = {
    type: "wheel,touch,pointer",
    wheelSpeed: -100,
    tolerance: 10,
    preventDefault: true,
  }

  function processFirstTimeline(index, direction, instance) {
    let fromTop = direction === -1;
    let dFactor = fromTop ? -1 : 1;
    let tl = gsap.timeline({
          defaults: { duration: 2, ease: "power1.inOut" },
        });
    if (currentIndex >= 0) {
      gsap.set(sections[currentIndex], { zIndex: 0 });
      tl.set(sections[currentIndex], { autoAlpha: 0 });
    }
    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    gsap.set(bgCover[index], {scale: 1});
      tl.to(bgCover[index], { scale: 1.1});
  }

  function goUpImage(index, direction, vY) {
    let fromTop = direction === -1;
    let dFactor = fromTop ? -1 : 1;
    let thumb = sections[index].querySelectorAll(".hero_images .thumb");
    let currentBg = sections[index].querySelector(".bg-cover")
    console.log(vY)
    let perpectiveValue = vY === 0 ?  5 : 10;
    thumb.forEach((el, idx) => {
      let tl = gsap.timeline({
        defaults: {duration: 0.2, ease: "power4.inOut" },
      });
      tl.to(el, {
        z: () => "+=" + perpectiveValue* (thumb.length - idx),
        opacity: () => "+=" + 0.5,
        ease: "power4.inOut"
      }, 0)
      .to(currentBg, {scale: () => "+=" + 0.1, ease: "power4.inOut"}, 0)
    })
  }


  
  function goDownImage(index, direction, vY) {
    let fromTop = direction === -1;
    let dFactor = fromTop ? -1 : 1;
    let thumb = sections[index].querySelectorAll(".hero_images .thumb");
    let currentBg = sections[index].querySelector(".bg-cover")
    console.log(vY)
    let perpectiveValue = vY === 0 ?  5 : 10;

    let tl = gsap.timeline({
      defaults: {duration: 10, ease: "power4.inOut" },
      onComplete: () => animating = false
    });
    tl.to(thumb, {
      z: (idx) => "-=" + perpectiveValue* (thumb.length - idx),
      opacity: () => "-=" + 0.5,
      ease: "power4.inOut"
    }, 0)
    .to(currentBg, {scale: () => "-=" + 0.1, ease: "power4.inOut"}, 0)
  }

  // function gotolastImage(index, thumbIndex, direction) {
  //   let fromTop = direction === -1;
  //   let dFactor = fromTop ? -1 : 1;
  //   let thumb = sections[index].querySelectorAll(".hero_images .thumb");
  //   if(thumbIndex) {
  //     let tl = gsap.timeline({
  //       defaults: { duration: 2, ease: "power1.inOut" },
  //     });
  //     tl.to(thumb[0], { opacity: 1 , ease: "power1.inOut"});
  //     tl.to(thumb[thumbIndex], {opacity: 1})
  //     tl.to(thumb[thumbIndex + 1], {opacity: 1})
  //   }
  // }

  function processSencondTimeline(index, direction) {
    let fromTop = direction === -1;
    let dFactor = fromTop ? -1 : 1;
    let thumb = sections[index].querySelectorAll(".hero_images .thumb");
    thumb.forEach((el, index) => {
			gsap.set(el, {
        zIndex: thumb.length - index,
				position: "absolute",
				width: el.clientWidth,
				height: el.clientHeight,
				overflow: "hidden",
				top: "30%",
				x: el.dataset.x * dFactor,
				y: el.dataset.y * dFactor,
        scale: (1.3 - dFactor),
				height: 675,
				width: 900,
        opacity: 0,
			});
		})
    let tl = gsap.timeline({
      defaults: { duration: 1, ease: "power1.inOut" },
      onComplete: () => {
        Observer.create({
          ...options,
          // onChange: (self) => {
            
          //   // gsap.to(progress, {
          //   //   duration: 2,
          //   //   ease: 'power4.out',
          //   //   value: `+=${p}`
          //   // })
          // },
          onDown: (self) => {
            if(self.velocityY) {
              goDownImage(index, 1, self.velocityY)
            }
          },
          onUp: (self) => {
            if(self.velocityY) {
              goUpImage(index, 1, self.velocityY)
            }
          },
        });
      }
    });
    tl.fromTo(thumb[0], {z: -3000}, { z: 0, opacity : 1 , ease: "power1.inOut"});
    thumbIdx = 0;
  }

  function gotoSection(index, direction) {
    index = wrap(index);
    animating = true;
    processFirstTimeline(index, direction)
    processSencondTimeline(index, direction)
    currentIndex = index;
  }

  if (ScrollTrigger.isTouch === 1) {
		gsap.set("#cursor", { opacity: 0 });
	} else {
		window.addEventListener("mousemove", (e) => {
      gsap.to(".service-sec .content", {
				xPercent: (-e.clientX / innerWidth) * 5,
				yPercent: -5 - (e.clientY / innerHeight) * 5
			});

			gsap.to("#cursor", { duration: 0.25, x: e.clientX, y: e.clientY})
		});
	}

  Observer.create({
    ...options,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
  });
  gotoSection(0, 1);
}

changeBackground()