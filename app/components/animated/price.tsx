import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedPrice({ amount }: { amount: number }) {
    const motionValue = useMotionValue(amount);
    const spring = useSpring(motionValue, { stiffness: 100, damping: 20 });
    const rounded = useTransform(spring, (val) => Math.round(val));

    const [displayValue, setDisplayValue] = useState(amount);

    useEffect(() => {
        motionValue.set(amount);
    }, [amount]);

    useEffect(() => {
        const unsubscribe = rounded.on("change", (val) => {
            setDisplayValue(val);
        });
        return () => unsubscribe();
    }, [rounded]);

    return <motion.p className="text-sm">R {displayValue}</motion.p>;
}
