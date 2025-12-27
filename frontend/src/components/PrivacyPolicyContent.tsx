export const PrivacyPolicyContent = () => {
  return (
    <div className="prose prose-sm max-w-none">
      <p className="text-gray-600 mb-4">
        <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        1. Information We Collect
      </h2>
      <p className="mb-4">
        We collect information you provide directly to us when you create an
        account, make a purchase, or communicate with us. This may include:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Name and email address</li>
        <li>Shipping and billing addresses</li>
        <li>
          Payment information (processed securely through third-party providers)
        </li>
        <li>Order history and preferences</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">We use the information we collect to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Process and fulfill your orders</li>
        <li>Send you order confirmations and updates</li>
        <li>Respond to your questions and provide customer support</li>
        <li>Send you marketing communications (with your consent)</li>
        <li>Improve our products and services</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        3. Information Sharing
      </h2>
      <p className="mb-4">
        We do not sell your personal information. We may share your information
        with:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Service providers who help us operate our business</li>
        <li>Payment processors to handle transactions</li>
        <li>Shipping companies to deliver your orders</li>
        <li>Law enforcement when required by law</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
      <p className="mb-4">
        We implement appropriate technical and organizational measures to
        protect your personal information against unauthorized access,
        alteration, disclosure, or destruction.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Rights</h2>
      <p className="mb-4">You have the right to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Access your personal information</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Opt-out of marketing communications</li>
        <li>Object to processing of your data</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">6. Cookies</h2>
      <p className="mb-4">
        We use cookies and similar technologies to enhance your browsing
        experience, analyze site traffic, and personalize content. You can
        control cookies through your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Privacy, please contact us at{" "}
        <a
          href="mailto:privacy@balmstore.com"
          className="text-blue-600 hover:underline"
        >
          privacy@balmstore.com
        </a>
      </p>
    </div>
  );
};
