import { useState, useRef } from "react";
import { X, FileText } from "lucide-react";

const API = import.meta.env.VITE_API_BASE;

const ApplyModal = ({ isOpen, onClose, jobId, jobTitle }) => {
  const [formData, setFormData] = useState({ fullName: "", email: "", message: "" });
  const [file, setFile]         = useState(null);
  const [fileError, setFileError]   = useState("");
  const [errors, setErrors]         = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError]   = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) { setFile(null); setFileError(""); return; }
    if (selectedFile.type !== "application/pdf") { setFileError("PDF only, max 2 MB"); setFile(null); return; }
    if (selectedFile.size > 2 * 1024 * 1024)    { setFileError("File size exceeds 2 MB"); setFile(null); return; }
    setFile(selectedFile);
    setFileError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!file) setFileError("Please upload your resume");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !fileError && file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validateForm()) return;

    const fd = new FormData();
    fd.append("jobId",    jobId);
    fd.append("jobTitle", jobTitle);
    fd.append("fullName", formData.fullName);
    fd.append("email",    formData.email);
    fd.append("message",  formData.message);
    fd.append("resume",   file);

    try {
      setIsSubmitting(true);
      const res  = await fetch(`${API}/api/applications`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({ fullName: "", email: "", message: "" });
          setFile(null);
          onClose();
        }, 2500);
      } else {
        setServerError(data.message || "Submission failed. Please try again.");
      }
    } catch {
      setServerError("Cannot connect to server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      {/* Modal — scrollable so nothing overflows the viewport */}
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}>

        {/* Header — sticky */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Apply for Job</h2>
            {jobTitle && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-72">{jobTitle}</p>}
          </div>
          <button onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Application Submitted!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Thank you for applying. We'll review your application and get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {serverError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded">
                  {serverError}
                </p>
              )}

              {/* Full Name */}
              <div>
                <input type="text" name="fullName" value={formData.fullName}
                  onChange={handleInputChange} placeholder="Full Name"
                  className="w-full border-b border-gray-300 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-600 transition" />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <input type="email" name="email" value={formData.email}
                  onChange={handleInputChange} placeholder="Email"
                  className="w-full border-b border-gray-300 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-600 transition" />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Resume Upload */}
              <div>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); validateFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current.click()}
                  className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-6 text-center cursor-pointer transition ${
                    file ? "border-green-400 bg-green-50/30"
                    : fileError ? "border-red-400 bg-red-50/30"
                    : "border-blue-400 hover:bg-blue-50/10"
                  }`}
                >
                  <input type="file" ref={fileInputRef} onChange={(e) => validateFile(e.target.files[0])}
                    accept=".pdf" className="hidden" />
                  <FileText size={32} className={file ? "text-green-500" : fileError ? "text-red-500" : "text-indigo-600"} />
                  <span className="mt-2.5 text-base font-medium text-indigo-600">
                    {file ? file.name : "Upload Resume"}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF only, max 2 MB"}
                  </span>
                </div>
                {fileError && <p className="mt-1 text-xs text-red-500 text-center">{fileError}</p>}
              </div>

              {/* Message */}
              <div>
                <textarea name="message" value={formData.message} onChange={handleInputChange}
                  placeholder="Message / Cover Letter (optional)" rows="3"
                  className="w-full resize-none border-b border-gray-300 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-600 transition" />
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50">
                {isSubmitting ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
