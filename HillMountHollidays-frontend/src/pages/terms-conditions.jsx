import { useState, useRef } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Sidebar groups ─── */
const GROUPS = [
  {
    id: "g1",
    label: "General Information",
    items: [
      { id: "s1-1", label: "1.1  Acceptance of Terms" },
      { id: "s1-2", label: "1.2  Company Information" },
      { id: "s1-3", label: "1.3  Official Communication Policy" },
      { id: "s1-4", label: "1.4  Payment Policy" },
      { id: "s1-5", label: "1.5  Scope of Services" },
      { id: "s1-6", label: "1.6  Right to Amend" },
    ],
  },
  {
    id: "g2",
    label: "Booking & Confirmation",
    items: [
      { id: "s2-1", label: "2.1  Booking Process" },
      { id: "s2-2", label: "2.2  Advance Payment Requirements" },
      { id: "s2-3", label: "2.3  Full Payment Deadlines" },
      { id: "s2-4", label: "2.4  Confirmation Process" },
      { id: "s2-5", label: "2.5  Booking Reference Number" },
    ],
  },
  {
    id: "g3",
    label: "Pricing Policy",
    items: [
      { id: "s3-1", label: "3.1  Price Availability" },
      { id: "s3-2", label: "3.2  Currency Fluctuations" },
      { id: "s3-3", label: "3.3  Fuel Surcharges & Transport Costs" },
      { id: "s3-4", label: "3.4  Tax Revisions" },
      { id: "s3-5", label: "3.5  Government Charges" },
      { id: "s3-6", label: "3.6  Pricing Errors" },
    ],
  },
  {
    id: "g4",
    label: "Guest Responsibilities",
    items: [
      { id: "s4-1", label: "4.1  Compliance with Laws" },
      { id: "s4-2", label: "4.2  Respect for Local Customs" },
      { id: "s4-3", label: "4.3  Conduct During Travel" },
      { id: "s4-4", label: "4.4  Alcohol, Drugs & Illegal Activities" },
      { id: "s4-5", label: "4.5  Travel Documents" },
    ],
  },
  {
    id: "g5",
    label: "Health & Medical Requirements",
    items: [
      { id: "s5-1", label: "5.1  Disclosure of Medical Conditions" },
      { id: "s5-2", label: "5.2  Fitness for Travel" },
      { id: "s5-3", label: "5.3  Medication Responsibility" },
      { id: "s5-4", label: "5.4  Pregnancy" },
      { id: "s5-5", label: "5.5  Medical Emergencies" },
    ],
  },
  {
    id: "g6",
    label: "Force Majeure",
    items: [{ id: "s6", label: "6.  Force Majeure" }],
  },
  {
    id: "g7",
    label: "Limitation of Liability",
    items: [{ id: "s7", label: "7.  Limitation of Liability" }],
  },
  {
    id: "g8",
    label: "Intellectual Property",
    items: [
      { id: "s8-1", label: "8.1  Ownership" },
      { id: "s8-2", label: "8.2  Website Content" },
      { id: "s8-3", label: "8.3  Veena World Content" },
      { id: "s8-4", label: "8.4  Unauthorised Use" },
    ],
  },
  {
    id: "g9",
    label: "Photography & Marketing Consent",
    items: [{ id: "s9", label: "9.  Photography & Marketing Consent" }],
  },
  {
    id: "g10",
    label: "Cancellation Policy",
    items: [{ id: "s10", label: "10.  Cancellation Policy" }],
  },
];

const BulletList = ({ items }) => (
  <ul className="mt-2 space-y-1">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-[13.5px] text-gray-700 leading-relaxed">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
        {item}
      </li>
    ))}
  </ul>
);

const SubSection = ({ id, title, children }) => (
  <div id={id} className="mb-6 scroll-mt-28">
    <h3 className="text-[14px] font-bold text-gray-900 mb-2">{title}</h3>
    <div className="text-[13.5px] text-gray-700 leading-relaxed space-y-2">{children}</div>
  </div>
);

const SectionBlock = ({ num, title, children }) => (
  <div className="mb-10">
    <h2 className="text-[16px] font-extrabold text-gray-900 mb-5 pb-2 border-b border-gray-200">
      {num}.&nbsp;&nbsp;{title}
    </h2>
    {children}
  </div>
);

/* ─── Page ─── */
const TermsAndConditions = () => {
  const [openGroup, setOpenGroup] = useState("g1");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggle = (id) => setOpenGroup((prev) => (prev === id ? null : id));

  return (
    <div className="w-full bg-white font-inter">

      {/* ── HERO ── */}
      <div className="bg-black text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1 text-[12px] mb-6 flex-wrap">
            <Link to="/" className="text-pink-300 hover:underline">Home</Link>
            <span className="text-gray-300 mx-1">&gt;</span>
            <span className="text-white">Terms And Conditions</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">Terms &amp; Conditions</h1>
          <p className="text-blue-200 text-[15px] mb-8 max-w-2xl">
            The terms, rules and guidelines about HillMount Holidays tours and services.
          </p>
          <p className="text-blue-100 text-[13px] mb-1">Prefer to speak to one of our expert advisors?</p>
          <div className="flex items-center gap-3">
  <Phone size={22} className="text-white" />

  <a href="tel:+919994666522">
    <span className="text-3xl font-extrabold tracking-wide cursor-pointer">
      +91 99946 66522
    </span>
  </a>
</div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6 items-start">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="w-72 flex-shrink-0 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <div className="space-y-2">
              {GROUPS.map((group) => {
                const isOpen = openGroup === group.id;
                return (
                  <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => toggle(group.id)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition"
                    >
                      <span className="text-[13px] font-semibold text-gray-800">{group.label}</span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="bg-blue-50/60 border-t border-gray-100 px-4 py-2 space-y-1">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            className="block w-full text-left text-[12.5px] text-blue-600 hover:text-blue-800 hover:underline py-1 leading-snug transition"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ── RIGHT CONTENT ── */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 px-8 py-8 min-w-0">

            {/* SECTION 1 */}
            <SectionBlock num="01" title="INTRODUCTION">
              <SubSection id="s1-1" title="1.1 Acceptance of Terms">
                <p>By submitting a booking request, making a payment, accepting a quotation, signing a booking form, or digitally accepting any communication sent through email, WhatsApp, SMS, online booking platform, or any electronic medium, the Traveller acknowledges that they have read, understood, and agreed to be bound by these Terms and Conditions, including all applicable booking conditions, cancellation policies, supplier conditions, and travel advisories.</p>
                <p>For legal and operational purposes, acceptance of any quotation, itinerary, invoice, booking confirmation, payment link, or travel document issued through the official Veena World booking system shall constitute valid electronic acceptance under the provisions of the Information Technology Act, 2000 and applicable laws of India.</p>
                <p>The Traveller further agrees that all communications, confirmations, invoices, travel vouchers, amendments, cancellation notices, and travel-related documentation may be delivered electronically and shall be deemed legally valid and binding.</p>
              </SubSection>

              <SubSection id="s1-2" title="1.2 Company Information">
                <p>"HillMount Holidays India Private Limited" (hereinafter referred to as "HillMount Holidays") is a company incorporated under the Companies Act, 2013 and operates as an Authorised Sales Partner of Veena Patil Hospitality Private Limited, the owner and operator of the travel brand "Veena World".</p>
                <p>HillMount Holidays is authorised to market, promote, assist, and facilitate bookings for travel products and services offered by Veena World within its designated territory, including the Coimbatore region and such other territories as may be authorised from time to time.</p>
                <p className="font-medium">For the avoidance of doubt:</p>
                <BulletList items={[
                  "HillMount Holidays acts solely as an Authorised Sales Partner and Booking Facilitator.",
                  "Veena Patil Hospitality Private Limited is the principal tour operator and service provider.",
                  "All tour operations, package execution, travel arrangements, supplier contracts, visas, transportation, accommodation, and destination services are provided directly or indirectly through Veena World and its authorised suppliers.",
                ]} />
                <p className="mt-2">Nothing contained herein shall be construed as creating any direct operational liability on HillMount Holidays beyond the scope of services specifically undertaken by it as an authorised sales partner.</p>
              </SubSection>

              <SubSection id="s1-3" title="1.3 Official Communication Policy">
                <p>For the safety and protection of customers, HillMount Holidays shall communicate only through authorised communication channels. Customers are advised to treat communications as official only when received from:</p>
                <BulletList items={[
                  "psp.hillmountholidays@veenaworld.com",
                  "Any email address ending with \"@veenaworld.com\"",
                  "Official WhatsApp Business accounts authorised by Veena World",
                  "Official telephone numbers: +91 99946 66522 and +91 422 43 66522",
                  "All Digital Handles under the name (Veena World – HillMount Holidays)",
                ]} />
                <p className="mt-2">HillMount Holidays shall not be responsible for any loss, fraud, misrepresentation, or unauthorised transaction arising from communications received from any unauthorised email address, telephone number, social media account, messaging application, or third party. Travellers are strongly advised to verify any payment request or travel instruction received from an unrecognised source before acting upon it.</p>
              </SubSection>

              <SubSection id="s1-4" title="1.4 Payment Policy">
                <p>For all bookings facilitated through HillMount Holidays, payments shall be made only in favour of 'Veena Patil Hospitality Pvt Ltd' payment channels provided by Veena World. Unless otherwise specifically communicated in writing by Veena World:</p>
                <BulletList items={[
                  "All booking payments shall be remitted only to the designated HDFC Bank account (50200005659468) maintained by Veena World.",
                  "Payment links shall be generated only through authorised Veena World systems.",
                  "Cash payments are discouraged and shall be accepted up to ₹25,000/- INR per PAN Card per Traveller as per the law and company policy.",
                  "Payment to any personal bank account, employee account, third-party account, UPI ID, wallet, or unauthorised payment channel shall be solely at the Traveller's risk.",
                ]} />
                <p className="mt-2">HillMount Holidays and Veena World shall not be liable for any loss arising from payments made to unauthorised persons or accounts.</p>
              </SubSection>

              <SubSection id="s1-5" title="1.5 Scope of Services">
                <p>HillMount Holidays is authorised to market and facilitate bookings for travel products offered by Veena World, including but not limited to:</p>
                <BulletList items={[
                  "Group Inclusive Tours (GIT)", "Personalised Holidays", "Family Holidays",
                  "Honeymoon Packages", "Corporate Travel", "Incentive Travel",
                  "Educational Tours", "Domestic Holiday Packages", "International Holiday Packages",
                  "Cruises", "Visa Assistance Services", "Travel Insurance Facilitation",
                  "Hotel Bookings", "Transportation Arrangements", "Ancillary Travel Services",
                ]} />
                <p className="mt-2">HillMount Holidays does not independently operate tours, transportation services, hotels, cruises, airlines, or visa authorities and shall not be liable for the acts, omissions, defaults, delays, or failures of any third-party supplier engaged by Veena World in connection with the travel services.</p>
              </SubSection>

              <SubSection id="s1-6" title="1.6 Right to Amend">
                <p>HillMount Holidays and Veena World reserve the right to amend, modify, update, revise, or replace these Terms and Conditions at any time without prior notice where required by law, regulatory requirements, operational necessity, supplier changes, or business considerations. The latest version published or communicated to the Traveller shall govern the booking and travel services unless otherwise specified in writing.</p>
              </SubSection>
            </SectionBlock>

            {/* SECTION 2 */}
            <SectionBlock num="02" title="BOOKING &amp; CONFIRMATION">
              <SubSection id="s2-1" title="2.1 Booking Process">
                <p>All bookings are subject to availability and acceptance by Veena World and its respective suppliers. A booking shall be considered as a request until it is confirmed in writing by Veena World.</p>
                <p>The Traveller shall provide complete, accurate, and truthful information, including but not limited to names as per passport, date of birth, nationality, contact details, passport information, visa information, and any special requirements. HillMount Holidays and Veena World shall not be responsible for losses arising from incorrect or incomplete information provided by the Traveller.</p>
              </SubSection>

              <SubSection id="s2-2" title="2.2 Advance Payment Requirements">
                <p>A booking shall be processed only upon receipt of the applicable booking amount, registration fee, or advance payment prescribed by Veena World for the selected travel package. The amount payable may vary depending on the destination, supplier requirements, airline policies, cruise policies, visa requirements, and booking timelines.</p>
              </SubSection>

              <SubSection id="s2-3" title="2.3 Full Payment Deadlines">
                <p>The Traveller shall pay the entire tour cost, taxes, surcharges, visa fees, insurance premiums, and any other applicable charges, 45 days before the departure date or timeline specified in the booking confirmation. Failure to make payment by the prescribed due date may result in cancellation of the booking without prior notice and may attract cancellation charges as applicable.</p>
              </SubSection>

              <SubSection id="s2-4" title="2.4 Confirmation Process">
                <p>A booking shall be deemed confirmed only after:</p>
                <BulletList items={[
                  "Receipt of the required payment.",
                  "Verification of traveller information.",
                  "Availability confirmation from suppliers.",
                  "Issuance of written confirmation by Veena World.",
                ]} />
                <p className="mt-2">Until written confirmation is issued directly by Veena World to the Guest email ID provided during the Booking process, no reservation, accommodation, airline seat, cruise cabin, visa appointment, or travel arrangement shall be deemed guaranteed.</p>
              </SubSection>

              <SubSection id="s2-5" title="2.5 Booking Reference Number">
                <p>Upon confirmation, a unique booking reference number shall be generated by the Veena World reservation system. All future communications, amendments, cancellations, refunds, complaints, and service requests must quote the booking reference number.</p>
              </SubSection>
            </SectionBlock>

            {/* SECTION 3 */}
            <SectionBlock num="03" title="PRICING POLICY">
              <SubSection id="s3-1" title="3.1 Price Availability">
                <p>All quotations, package prices, promotional offers, and advertisements are subject to availability at the time of booking and may change without prior notice. No price shall be deemed guaranteed until the booking is confirmed and the applicable payment has been received.</p>
              </SubSection>
              <SubSection id="s3-2" title="3.2 Currency Fluctuations">
                <p>International tour prices may be affected by fluctuations in foreign exchange rates. Any such variation may result in price adjustments and shall be borne by the Traveller.</p>
              </SubSection>
              <SubSection id="s3-3" title="3.3 Fuel Surcharges and Transportation Costs">
                <p>Airlines, cruise operators, transport providers, and other suppliers may impose fuel surcharges, aviation taxes, airport charges, port charges, or transportation-related levies at any time. Any such increase shall be borne by the Traveller.</p>
              </SubSection>
              <SubSection id="s3-4" title="3.4 Tax Revisions">
                <p>Any increase in GST, TCS, airport taxes, tourism taxes, visa fees, service charges, government duties, or statutory levies imposed after booking shall be payable by the Traveller.</p>
              </SubSection>
              <SubSection id="s3-5" title="3.5 Government Charges">
                <p>Any new government regulation, permit fee, tourism fee, entry tax, conservation fee, environmental fee, or similar levy introduced after booking shall be recoverable from the Traveller.</p>
              </SubSection>
              <SubSection id="s3-6" title="3.6 Pricing Errors">
                <p>HillMount Holidays and Veena World reserve the right to correct any pricing, calculation, typographical, system-generated, or administrative errors discovered before or after booking confirmation. Where a material pricing error exists, the Traveller shall have the option to accept the corrected price or cancel the booking and receive a refund of amounts paid.</p>
              </SubSection>
            </SectionBlock>

            {/* SECTION 4 */}
            <SectionBlock num="04" title="GUEST RESPONSIBILITIES">
              <SubSection id="s4-1" title="4.1 Compliance with Laws">
                <p>Travellers shall comply with all applicable laws, regulations, customs requirements, immigration requirements, and local government directives in every destination visited.</p>
              </SubSection>
              <SubSection id="s4-2" title="4.2 Respect for Local Customs">
                <p>Travellers shall respect local customs, traditions, cultural sensitivities, religious beliefs, dress codes, and social norms at all destinations.</p>
              </SubSection>
              <SubSection id="s4-3" title="4.3 Conduct During Travel">
                <p>Travellers shall maintain respectful behaviour throughout the journey and shall not engage in conduct that may:</p>
                <BulletList items={[
                  "Endanger themselves or others.",
                  "Disrupt tour operations.",
                  "Cause inconvenience to fellow travellers.",
                  "Damage property.",
                  "Violate local laws.",
                ]} />
              </SubSection>
              <SubSection id="s4-4" title="4.4 Alcohol, Drugs and Illegal Activities">
                <p>The use, possession, transportation, or distribution of illegal drugs, prohibited substances, or participation in unlawful activities shall result in immediate removal from the tour without refund.</p>
              </SubSection>
              <SubSection id="s4-5" title="4.5 Travel Documents">
                <p>The Traveller shall be solely responsible for possessing:</p>
                <BulletList items={[
                  "Valid passport.", "Required visas.", "Vaccination certificates.",
                  "Immigration approvals.", "Travel insurance documents.",
                  "Any other travel documentation required by authorities.",
                ]} />
                <p className="mt-2">Failure to possess valid documentation shall be solely at the Traveller's risk.</p>
              </SubSection>
            </SectionBlock>

            {/* SECTION 5 */}
            <SectionBlock num="05" title="HEALTH &amp; MEDICAL REQUIREMENTS">
              <SubSection id="s5-1" title="5.1 Disclosure of Medical Conditions">
                <p>Travellers must disclose any pre-existing medical condition, disability, mobility limitation, allergy, dietary restriction, pregnancy, or special assistance requirement at the time of booking. Failure to disclose such information may result in denial of participation in certain activities.</p>
              </SubSection>
              <SubSection id="s5-2" title="5.2 Fitness for Travel">
                <p>Travellers are responsible for ensuring that they are medically fit to undertake the tour and participate in planned activities. HillMount Holidays may require a medical fitness certificate where considered necessary.</p>
              </SubSection>
              <SubSection id="s5-3" title="5.3 Medication Responsibility">
                <p>Travellers shall carry adequate quantities of prescribed medications and shall be solely responsible for their storage, transportation, and administration.</p>
              </SubSection>
              <SubSection id="s5-4" title="5.4 Pregnancy">
                <p>Pregnant travellers must comply with airline, cruise, and supplier policies. HillMount Holidays and Veena World reserve the right to refuse participation where travel may present health or safety concerns.</p>
              </SubSection>
              <SubSection id="s5-5" title="5.5 Medical Emergencies">
                <p>Any medical expenses, hospitalization costs, evacuation expenses, quarantine costs, repatriation expenses, or emergency transportation costs shall be borne solely by the Traveller unless covered by travel insurance.</p>
              </SubSection>
            </SectionBlock>

            {/* SECTION 6 */}
            <SectionBlock num="06" title="FORCE MAJEURE">
              <div id="s6" className="scroll-mt-28">
                <p className="text-[13.5px] text-gray-700 leading-relaxed mb-3">Neither HillMount Holidays nor Veena World shall be liable for any delay, cancellation, modification, loss, additional expense, or failure to perform obligations arising from events beyond reasonable control, including but not limited to:</p>
                <BulletList items={[
                  "Natural disasters, floods, cyclones, earthquakes, landslides, volcanic activity.",
                  "Pandemic or epidemic outbreaks, public health emergencies.",
                  "Government restrictions, travel bans, border closures.",
                  "Political unrest, civil disturbances, riots, terrorist activities.",
                  "War or threat of war, strikes or labour disputes.",
                  "Airline suspension of operations, airport closures.",
                  "Supplier insolvency, utility failures, acts of God.",
                ]} />
                <p className="text-[13.5px] text-gray-700 leading-relaxed mt-3">Any resulting losses, additional accommodation expenses, transportation expenses, quarantine costs, or rebooking costs may be recoverable from the Traveller.</p>
              </div>
            </SectionBlock>

            {/* SECTION 7 */}
            <SectionBlock num="07" title="LIMITATION OF LIABILITY">
              <div id="s7" className="scroll-mt-28">
                <p className="text-[13.5px] text-gray-700 leading-relaxed mb-3">HillMount Holidays acts solely as an authorised sales partner and booking facilitator. To the maximum extent permitted by law, HillMount Holidays shall not be liable for:</p>
                <BulletList items={[
                  "Airline delays or cancellations, missed connections.",
                  "Visa refusal or delays, passport issues.",
                  "Lost, stolen, delayed, or damaged baggage.",
                  "Theft or loss of personal belongings.",
                  "Injury caused by third parties, illness during travel.",
                  "Hotel overbooking, supplier failure.",
                  "Weather-related disruptions, government actions.",
                  "Immigration decisions, denied boarding.",
                  "Cruise itinerary changes, natural disasters, force majeure events.",
                ]} />
                <p className="text-[13.5px] text-gray-700 leading-relaxed mt-3">In all circumstances, the total liability of HillMount Holidays shall not exceed the amount of commission received by HillMount Holidays in relation to the specific booking giving rise to the claim.</p>
              </div>
            </SectionBlock>

            {/* SECTION 8 */}
            <SectionBlock num="08" title="INTELLECTUAL PROPERTY">
              <SubSection id="s8-1" title="8.1 Ownership">
                <p>All intellectual property rights relating to HillMount Holidays, including trade name, business name, brand identity, logo, website content, marketing materials, brochures, travel guides, designs, graphics, videos, and written content, shall remain the exclusive property of HillMount Holidays or its licensors.</p>
              </SubSection>
              <SubSection id="s8-2" title="8.2 Website Content">
                <p>No person may reproduce, copy, distribute, modify, publish, transmit, display, sell, license, or commercially exploit any website content without prior written permission.</p>
              </SubSection>
              <SubSection id="s8-3" title="8.3 Veena World Content">
                <p>Certain content, itineraries, package descriptions, images, videos, trademarks, and branding appearing on HillMount Holidays platforms may belong to Veena World and remain the exclusive property of Veena Patil Hospitality Private Limited.</p>
              </SubSection>
              <SubSection id="s8-4" title="8.4 Unauthorised Use">
                <p>Unauthorised use of intellectual property may result in civil and criminal proceedings under applicable Indian laws.</p>
              </SubSection>
            </SectionBlock>

            {/* SECTION 9 */}
            <SectionBlock num="09" title="PHOTOGRAPHY &amp; MARKETING CONSENT">
              <div id="s9" className="scroll-mt-28 text-[13.5px] text-gray-700 leading-relaxed space-y-3">
                <p>The Traveller acknowledges that photographs, videos, audio recordings, testimonials, reviews, social media content, and other visual materials may be captured during tours, events, activities, or travel experiences.</p>
                <p>Unless the Traveller expressly objects in writing before departure, the Traveller grants HillMount Holidays and Veena World a worldwide, royalty-free, perpetual, transferable, and non-exclusive right to use such materials for marketing, advertising, social media promotion, website publication, brochures, press releases, corporate presentations, and promotional campaigns. Such usage shall not entitle the Traveller to any compensation.</p>
                <p>Where required by applicable law, HillMount Holidays shall honour reasonable written requests to withdraw future use of identifiable photographs or videos.</p>
              </div>
            </SectionBlock>

            {/* SECTION 10 */}
            <SectionBlock num="10" title="CANCELLATION POLICY">
              <div id="s10" className="scroll-mt-28 text-[13.5px] text-gray-700 leading-relaxed">
                <p>For details on cancellation charges, timelines, and refund procedures, please refer to the official Veena World Cancellation & Refund Policy at:</p>
                <a
                  href="https://www.veenaworld.com/faq/cancellation-and-refund"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all font-medium mt-1 inline-block"
                >
                  https://www.veenaworld.com/faq/cancellation-and-refund
                </a>
              </div>
            </SectionBlock>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
