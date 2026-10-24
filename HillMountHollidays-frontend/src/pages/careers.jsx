import { useState, useRef, useEffect } from "react";
import { Clock, MapPin, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import ApplyModal from "../components/ApplyModal";
import { Link } from "react-router-dom";
const API = import.meta.env.VITE_API_BASE;

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openingsRef = useRef(null);
   
  useEffect(() => {
    fetch(`${API}/api/careers`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setJobs(d.data); else setFetchError("Failed to load jobs."); })
      .catch(() => setFetchError("Cannot connect to server."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [selectedJob]);

  const handleViewOpenings = () =>
    openingsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-inter pb-16 overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3.5 px-4 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5">
          <Link to="/" className="hover:text-gray-900 cursor-pointer">
            Home
          </Link>
          <span className="text-gray-400 font-semibold">&gt;</span>
          <span className="text-gray-900 font-semibold">Careers</span>
        </div>
      </div>

      {!selectedJob ? (
        /* ─── LIST VIEW ─── */
        <div>
          {/* Hero */}
          <div className="bg-black text-white px-4 py-20 md:py-24 text-center md:text-left">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Welcome to our World!
              </h1>
              <p className="text-lg md:text-xl text-blue-100 font-light leading-relaxed mb-8 max-w-3xl">
                Come join our team at HillMount Holidays to experience an exciting workplace culture,
                fantastic colleagues, and a people-first community that empowers you to grow.
              </p>
              <button
                onClick={handleViewOpenings}
                className="bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold text-[14px] px-6 py-2.5 rounded-sm shadow-md transition cursor-pointer"
              >
                View current openings
              </button>
            </div>
          </div>

          {/* Openings */}
          <div ref={openingsRef} className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Openings</h2>
            <p className="text-gray-600 text-[15px] leading-relaxed italic mb-8">
              If you don't see a role that matches your profile, we'd still love to hear from you.
              <br />
              Please share your resume at{" "}
              <a href="mailto:careers@hillmountholidays.com"
                className="text-gray-800 font-bold hover:underline not-italic ml-1">
                careers@hillmountholidays.com
              </a>
            </p>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={32} className="animate-spin text-yellow-400" />
              </div>
            ) : fetchError ? (
              <p className="text-center text-red-400 text-sm py-10">{fetchError}</p>
            ) : jobs.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">No openings at the moment. Check back soon!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div key={job._id} onClick={() => setSelectedJob(job)}
                    className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group relative">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                        {job.category}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-[#1d408f] leading-snug group-hover:text-blue-700 transition mb-6">
                        {job.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-6 text-gray-500 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} className="text-gray-400" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={16} className="text-gray-400" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-gray-100 group-hover:bg-[#1d408f] flex items-center justify-center text-gray-500 group-hover:text-white transition duration-300">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ─── DETAIL VIEW ─── */
        <div>
          {/* Job Banner */}
          <div className="bg-black text-white px-4 py-16 md:py-20">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                {selectedJob.title}
              </h1>
              <p className="text-blue-200 text-sm md:text-base font-medium mb-6">
                {selectedJob.department} / {selectedJob.location} / {selectedJob.employmentType}
              </p>
              <button onClick={() => setIsModalOpen(true)}
                className="bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold text-[14px] px-6 py-2.5 rounded-sm shadow-md transition cursor-pointer">
                Apply Now
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
              <button onClick={() => setSelectedJob(null)}
                className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold text-sm transition">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <hr className="mt-4 border-gray-200" />
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-xs border border-gray-100 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Job Description</h2>

                {selectedJob.eligibility?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-base font-bold text-gray-800 mb-3">Eligibility</h3>
                    <ul className="list-disc pl-5 space-y-2.5 text-gray-600 text-[15px]">
                      {selectedJob.eligibility.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}

                {selectedJob.workWillInclude?.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3">Work Will Include</h3>
                    <ul className="list-disc pl-5 space-y-2.5 text-gray-600 text-[15px] leading-relaxed">
                      {selectedJob.workWillInclude.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ApplyModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            jobId={selectedJob._id}
            jobTitle={selectedJob.title}
          />
        </div>
      )}
    </div>
  );
};

export default Careers;
