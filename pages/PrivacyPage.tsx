
import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto prose lg:prose-xl">
      <h1 className="font-serif">Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
      
      <h2>1. Collecting and Using Your Personal Data</h2>
      <h3>Types of Data Collected</h3>
      <h4>Personal Data</h4>
      <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number, Address, State, Province, ZIP/Postal code, City.</p>
      
      <h4>Usage Data</h4>
      <p>Usage Data is collected automatically when using the Service. This may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>

      <h4>Camera and Microphone Data</h4>
      <p>When you use our visual or voice search features, we access your device's camera or microphone. For visual search, an image is captured and sent to our AI service for analysis. For voice search, your speech is transcribed into text. This data is used solely for the purpose of fulfilling your search request and is not stored long-term.</p>
      
      <h2>2. Use of Your Personal Data</h2>
      <p>The Company may use Personal Data for the following purposes: to provide and maintain our Service, to manage Your Account, for the performance of a contract, to contact You, to provide You with news, special offers and general information about other goods, services and events which we offer.</p>
      
      <p>This is a placeholder document. For a real application, consult a legal professional.</p>
    </div>
  );
};

export default PrivacyPage;
