/**
 * Alarm Border Component
 * Red pulsing border for critical alerts
 */

import { motion } from "framer-motion";
import { alarmBorder } from "@/ui/animation/bossEffects";

interface AlarmBorderProps {
  enabled: boolean;
  children: React.ReactNode;
}

export const AlarmBorder: React.FC<AlarmBorderProps> = ({
  enabled,
  children,
}) => {
  return (
    <motion.div
      className="relative"
      animate={enabled ? "visible" : "normal"}
      variants={{
        visible: alarmBorder.visible,
        normal: {
          boxShadow: "none",
          borderColor: "transparent",
        },
      }}
      style={{
        borderWidth: enabled ? "4px" : "0px",
        borderStyle: "solid",
      }}
    >
      {children}
    </motion.div>
  );
};

