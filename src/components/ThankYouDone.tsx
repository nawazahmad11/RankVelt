import { motion } from "framer-motion";
import { CheckCircle, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";


// code by nawaz

const ThankYouDone = () => {
  const [selectedPlan, setSelectedPlan] = useState("Direct Inquiry");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("package");
    if (plan) {
      setSelectedPlan(decodeURIComponent(plan));
    }
  }, []);


  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-16">
      <motion.div
        className="glass-card p-10 text-center max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 check-green" />
        </div>
        <h2 className="text-2xl font-bold mb-3">You're All Set! 🎉</h2>
        <p className="text-muted-foreground mb-4">
          Your request for <span className="text-primary font-bold">{selectedPlan}</span> has been confirmed.
        </p>
        <div className="glass-card p-4 text-left text-sm">
          <p className="text-muted-foreground">
            <MessageSquare className="w-4 h-4 inline mr-1.5 check-green" />
            Expect a WhatsApp message from me personally to finalize your call time.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYouDone;