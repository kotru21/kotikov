"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { useSkillsInteraction } from "../model/SkillsInteractionContext";

interface SkillsCursorNyancatProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

const SkillsCursorNyancat: React.FC<SkillsCursorNyancatProps> = ({
  containerRef,
}) => {
  const catRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  
  // Physics / Animation State
  const currentPos = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  
  // Jump State
  const jumpStartTime = useRef<number>(0);
  const isJumping = useRef(false);
  const jumpTargetElement = useRef<HTMLElement | null>(null);
  const jumpTargetPos = useRef<{x: number, y: number} | null>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isFacingRight, setIsFacingRight] = useState(true);

  const { activeElement, mousePos, setMousePos } = useSkillsInteraction();

  // Mouse tracking logic moved to context provider basically, but here we just update it
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
      
      // Face direction update based on mouse movement
      // Only update facing if we are "chasing" the mouse (not on a card) 
      // OR just update it based on target direction always?
      // Let's update facing based on movement delta in the animation loop for smoothness
    };

    const handleMouseEnter = (): void => {
      setIsVisible(true);
    };

    const handleMouseLeave = (): void => {
      setIsVisible(false);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef, setMousePos]);



  const targetState = useRef({ activeElement, mousePos });
  useEffect(() => {
    targetState.current = { activeElement, mousePos };
  }, [activeElement, mousePos]);
  
  // Re-write separate effect for the loop using targetState ref
  useEffect(() => {
      const JUMP_DURATION = 500;
      const JUMP_HEIGHT = 100;
      const DISTANCE_THRESHOLD = 60; 

      const animate = (time: number): void => {
        if (!catRef.current || !containerRef.current) {
            frameRef.current = requestAnimationFrame(animate);
            return;
        }

        const { activeElement, mousePos } = targetState.current;
        const targetX = mousePos.x;
        const targetY = mousePos.y;
        
        // --- LOGIC: DETERMINE "DESIRED" TARGET ---
        // If we are jumping, we ignore the current mouse/hover state and fly towards the LOCKED target
        // If we are grounded, we look at the current mouse/hover state
        
        let effectiveTargetX = targetX;
        let effectiveTargetY = targetY;

        if (isJumping.current) {
             // We are mid-jump. Calculate target based on what we locked onto at start of jump.
             if (jumpTargetElement.current) {
                 const containerRect = containerRef.current.getBoundingClientRect();
                 const elRect = jumpTargetElement.current.getBoundingClientRect();
                 effectiveTargetX = elRect.left - containerRect.left + elRect.width / 2;
                 effectiveTargetY = elRect.top - containerRect.top; 
             } else if (jumpTargetPos.current) {
                 effectiveTargetX = jumpTargetPos.current.x;
                 effectiveTargetY = jumpTargetPos.current.y;
             }
        } else {
            // We are Grounded. Look at live state.
            if (activeElement) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const elRect = activeElement.getBoundingClientRect();
                effectiveTargetX = elRect.left - containerRect.left + elRect.width / 2;
                effectiveTargetY = elRect.top - containerRect.top; 
            } else {
                // effectiveTarget is already mousePos
            }
        }

        const dx = effectiveTargetX - currentPos.current.x;
        const dy = effectiveTargetY - currentPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (!isJumping.current && dist > DISTANCE_THRESHOLD) {
                // START JUMP
                isJumping.current = true;
                jumpStartTime.current = time;
                startPos.current = { ...currentPos.current };
                
                // LOCK TARGET for duration of jump
                if (activeElement) {
                    jumpTargetElement.current = activeElement;
                    jumpTargetPos.current = null;
                } else {
                    jumpTargetElement.current = null;
                    jumpTargetPos.current = { x: mousePos.x, y: mousePos.y };
                }

                // Determine direction at start of jump
                setIsFacingRight(effectiveTargetX > currentPos.current.x);
        } else if (!isJumping.current) {
                // Riding / Small Following with heavier damping
                 const lerpFactor = 0.15;
                 currentPos.current.x += (effectiveTargetX - currentPos.current.x) * lerpFactor;
                 currentPos.current.y += (effectiveTargetY - currentPos.current.y) * lerpFactor;
                 
                 // Face direction of movement even when riding
                 if (Math.abs(dx) > 2) {
                     setIsFacingRight(dx > 0);
                 }
        } else {
            // IN JUMP
            const timeElapsed = time - jumpStartTime.current;
            const progress = Math.min(timeElapsed / JUMP_DURATION, 1);
            
            const ease = progress; 

            // Use effectiveTarget (locked) for calculation
            const linearX = startPos.current.x + (effectiveTargetX - startPos.current.x) * ease;
            const linearY = startPos.current.y + (effectiveTargetY - startPos.current.y) * ease;
            
            // Jump Arc
            const jumpY = -Math.sin(progress * Math.PI) * JUMP_HEIGHT;

            currentPos.current.x = linearX;
            currentPos.current.y = linearY + jumpY;

            if (progress >= 1) {
                isJumping.current = false;
                jumpTargetElement.current = null;
                jumpTargetPos.current = null;
            }
        }

        catRef.current.style.transform = `translate(${String(currentPos.current.x - 25)}px, ${String(currentPos.current.y - 25)}px)`;
        frameRef.current = requestAnimationFrame(animate);
      };
      
      frameRef.current = requestAnimationFrame(animate);
      return () => { cancelAnimationFrame(frameRef.current); };
  }, [containerRef]);

  return (
    <div
      ref={catRef}
      className={`absolute top-0 left-0 pointer-events-none z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        willChange: "transform",
      }}>
      <div 
        className="relative transition-transform duration-200"
        style={{
            transform: isFacingRight ? "scaleX(1)" : "scaleX(-1)"
        }}
      >
        <Image
            src="/nyancat.svg"
            alt="Nyancat"
            width={50}
            height={33}
            className="drop-shadow-2xl" 
            priority
        />
      </div>
    </div>
  );
};

export default SkillsCursorNyancat;
