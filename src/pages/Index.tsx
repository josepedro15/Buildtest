import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import UseCases from "@/components/UseCases";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1f2937' }}>
          MetricaWhats
        </h1>
        <p style={{ color: '#6b7280' }}>
          Analytics para WhatsApp
        </p>
      </div>
    </div>
  );
};

export default Index;
