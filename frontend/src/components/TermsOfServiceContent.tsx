export const TermsOfServiceContent = () => {
  return (
    <div className="prose prose-sm max-w-none">
      <p className="text-gray-600 mb-4">
        <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        1. Acceptance of Terms
      </h2>
      <p className="mb-4">
        By accessing and using this website, you accept and agree to be bound by
        the terms and provision of this agreement. If you do not agree to these
        terms, please do not use this website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">2. Use License</h2>
      <p className="mb-4">
        Permission is granted to temporarily download one copy of the materials
        on BALM Store's website for personal, non-commercial transitory viewing
        only.
      </p>
      <p className="mb-4">Under this license you may not:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Modify or copy the materials</li>
        <li>Use the materials for any commercial purpose</li>
        <li>Attempt to decompile or reverse engineer any software</li>
        <li>Remove any copyright or proprietary notations</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        3. Product Information
      </h2>
      <p className="mb-4">
        We strive to provide accurate product descriptions and pricing. However,
        we do not warrant that product descriptions, pricing, or other content
        is accurate, complete, reliable, current, or error-free.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">4. Orders and Pricing</h2>
      <p className="mb-4">
        We reserve the right to refuse or cancel any order for any reason. We
        may require additional verification or information before accepting an
        order. Prices are subject to change without notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">5. Payment Terms</h2>
      <p className="mb-4">
        Payment must be received before your order is processed. We accept major
        credit cards and other payment methods as indicated on our site. All
        payments are processed securely through third-party payment providers.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        6. Shipping and Delivery
      </h2>
      <p className="mb-4">
        We will make every effort to deliver your order within the estimated
        timeframe. However, we are not responsible for delays caused by shipping
        carriers or circumstances beyond our control.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        7. Returns and Refunds
      </h2>
      <p className="mb-4">
        Our return policy allows returns within 30 days of purchase for unworn,
        unwashed items with original tags attached. Refunds will be processed to
        the original payment method within 5-10 business days of receiving the
        returned item.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        8. Intellectual Property
      </h2>
      <p className="mb-4">
        All content on this website, including text, graphics, logos, images,
        and software, is the property of BALM Store and is protected by
        copyright and trademark laws.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        9. Limitation of Liability
      </h2>
      <p className="mb-4">
        BALM Store shall not be liable for any indirect, incidental, special, or
        consequential damages arising out of or in connection with the use of
        our website or products.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">10. Governing Law</h2>
      <p className="mb-4">
        These terms shall be governed by and construed in accordance with the
        laws of the jurisdiction in which BALM Store operates.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">11. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to modify these terms at any time. Changes will be
        effective immediately upon posting to the website. Your continued use of
        the website constitutes acceptance of the modified terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        12. Contact Information
      </h2>
      <p className="mb-4">
        For questions about these TOS, please contact us at{" "}
        <a
          href="mailto:support@balmstore.com"
          className="text-blue-600 hover:underline"
        >
          support@balmstore.com
        </a>
      </p>
    </div>
  );
};
