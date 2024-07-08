const prisma = require("../configs/prisma.config");

async function main() {
  let admin = false;
  let settings = false;
  if (admin) {
    await prisma.admin.upsert({
      where: { email: "powerhour@gmail.com" },
      update: {
        email: "powerhour@gmail.com",
        password:
          "$2a$10$ckO91.GEU5hAyC85s5w2H.HGZi3NHlsheSHvXLfuP0zhqoBb5kB.2",
      },
      create: {
        email: "powerhour@gmail.com",
        password:
          "$2a$10$ckO91.GEU5hAyC85s5w2H.HGZi3NHlsheSHvXLfuP0zhqoBb5kB.2",
      },
    });
    console.log("admin inserted successfully");
  }

  if (settings) {
    let samplePrivacyPolicy = `At [Your Company Name], we value your privacy and are committed to protecting your personal data. 
This privacy policy outlines how we collect, use, and protect your information when you visit our website or use our services. 
By accessing our website, you consent to the practices described in this policy.
We collect various types of information to provide and improve our services. This includes personal identification information such as your name, email address, phone number, and physical address. 
We may also collect technical data such as your IP address, browser type, time zone setting, and operating system. Additionally, we gather usage data that details how you interact with our website, such as pages viewed and links clicked. 
Marketing and communication data,
including your preferences in receiving marketing from us and your communication preferences, may also be collected.
Our data collection methods include direct interactions, automated technologies, and third-party sources.You may provide us with personal data by filling out forms or contacting us through various means. 
We also collect data automatically as you navigate our website through the use of cookies and other tracking technologies. Additionally, we may receive personal data from third parties and public sources.
We use the information we collect for several purposes. 
Primarily, it allows us to provide and improve our services, manage your account, process transactions, and offer customer support. We also use your data to communicate with you, sending updates, marketing materials,
 and other information that may interest you. 
Personalizing your experience on our website is another important use of your data, enabling us to tailor content and advertisements to your interests. 
Moreover, we use your data to enhance the security of our website and protect against fraudulent transactions.
We may share your personal information with trusted third parties who provide services on our behalf, such as website hosting, data analysis, payment processing, order fulfillment, and IT support. 
These third parties are obligated to protect your data and use it only for the purposes we specify. In the event of a business transfer, such as a merger, acquisition, or sale of assets, your data may be transferred to the new owner. 
Additionally, we may disclose your information if required by law or in response to valid requests by public authorities.
Protecting your data is a top priority. We implement appropriate technical and organizational measures to safeguard your personal information. However, 
please note that no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including satisfying legal, accounting, or reporting requirements. 
Once your data is no longer needed, we will securely dispose of it.Under data protection laws, you have rights regarding your personal data. 
These rights may include requesting access to your data, correcting inaccuracies, requesting deletion, and restricting or objecting to processing. To exercise your rights, please contact us using the information provided on our website.
We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. 
We encourage you to review this policy periodically to stay informed about how we protect your information. Your continued use of our website after any modifications signifies your acceptance of the updated policy.
If you have any questions or concerns about this privacy policy or our data practices, please contact us at [Your Contact Information]. We are committed to addressing your inquiries and resolving any issues you may have. Thank you for trusting [Your Company Name] with your personal information`;
    let sampleTermsAndConditions = `Welcome to [Your Company Name]. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing or using our website, you accept these terms and conditions in full. 
    If you disagree with any part of these terms and conditions, please do not use our website.
The content on this website is for general information and use only. 
It is subject to change without notice. We do not provide any warranty or guarantee regarding the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website. 
You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services, or information`;
    let sampleAboutApp = `Welcome to [Your Application Name], designed to provide a seamless and intuitive experience for managing your [describe the main purpose or function of the application, e.g., personal finances, daily tasks, social connections]. Our application combines a user-friendly interface with powerful features to help you achieve your goals efficiently. With an emphasis on [mention key aspects such as organization, communication, convenience], we strive to exceed your expectations. Our application includes intuitive design, robust functionality like [list a few core features], and extensive customization options, all while ensuring top-notch security for your data. Our dedicated support team is always ready to assist you, 
    making [Your Application Name] a reliable companion in your daily life`;
    await prisma.appSettings.create({
      data: {
        privacyPolicy: samplePrivacyPolicy,
        termsAndConditions: sampleTermsAndConditions,
        aboutApp: sampleAboutApp,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
