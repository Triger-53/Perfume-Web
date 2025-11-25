
import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto prose lg:prose-xl">
      <h1 className="font-serif">Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>Please read these terms and conditions carefully before using Our Service.</p>
      
      <h2>1. Interpretation and Definitions</h2>
      <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
      
      <h2>2. Acknowledgment</h2>
      <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
      
      <h2>3. Placing Orders for Goods</h2>
      <p>By placing an Order for Goods through the Service, You warrant that You are legally capable of entering into binding contracts.</p>
      
      <h2>4. Payments</h2>
      <p>All Goods purchased are subject to a one-time payment. Payment can be made through various payment methods we have available, such as Visa, MasterCard, Affinity Card, American Express cards or online payment methods (Razorpay, for example).</p>
      
      <h2>5. Termination</h2>
      <p>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
      
      <p>This is a placeholder document. For a real application, consult a legal professional.</p>
    </div>
  );
};

export default TermsPage;
