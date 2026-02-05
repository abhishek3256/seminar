import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, List, Loader2, Save, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '', // Will split by line/comma
        location: '',
        type: 'Full-time',
        salaryRange: '', // e.g., "10-20 LPA"
        experienceLevel: 'Fresher',
        skills: '' // comma separated
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Process basic text fields into expected format
            // Company Controller expects: title, description, requirements (array), location, type, salaryRange, etc.
            // Check Job model for correct keys.
            // Job model: title, description, companyId, location, type, salaryRange, requirements (Array), requiredSkills (Array), etc.

            const payload = {
                ...formData,
                requirements: formData.requirements.split('\n').filter(line => line.trim() !== ''),
                requiredSkills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
            };

            const res = await api.post('/company/jobs', payload);
            if (res.data.success) {
                navigate('/dashboard'); // Redirect to company dashboard
            }
        } catch (error) {
            console.error("Failed to post job", error);
            alert(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white mb-6 transition">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Post a New Job</h1>
                        <p className="text-slate-400">Reach the best talent from our campus.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Job Title</label>
                            <div className="relative">
                                <Briefcase className="absolute top-3 left-3 text-slate-600" size={18} />
                                <input
                                    type="text" name="title" required
                                    value={formData.title} onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                    placeholder="e.g. Junior Software Engineer"
                                />
                            </div>
                        </div>

                        {/* Location & Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute top-3 left-3 text-slate-600" size={18} />
                                    <input
                                        type="text" name="location" required
                                        value={formData.location} onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                        placeholder="e.g. Bangalore, Remote"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Employment Type</label>
                                <div className="relative">
                                    <Clock className="absolute top-3 left-3 text-slate-600" size={18} />
                                    <select
                                        name="type"
                                        value={formData.type} onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Part-time">Part-time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Salary & Exp */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Salary Range</label>
                                <div className="relative">
                                    <DollarSign className="absolute top-3 left-3 text-slate-600" size={18} />
                                    <input
                                        type="text" name="salaryRange" required
                                        value={formData.salaryRange} onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                        placeholder="e.g. 12-15 LPA"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Experience Level</label>
                                <select
                                    name="experienceLevel"
                                    value={formData.experienceLevel} onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
                                >
                                    <option value="Fresher">Fresher (0-1 yrs)</option>
                                    <option value="Junior">Junior (1-3 yrs)</option>
                                    <option value="Mid">Mid-Level (3-5 yrs)</option>
                                    <option value="Senior">Senior (5+ yrs)</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Job Description</label>
                            <textarea
                                name="description" required
                                value={formData.description} onChange={handleChange}
                                rows={5}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                placeholder="Details about the role..."
                            />
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Requirements (one per line)</label>
                            <div className="relative">
                                <List className="absolute top-3 left-3 text-slate-600" size={18} />
                                <textarea
                                    name="requirements" required
                                    value={formData.requirements} onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                    placeholder="- Strong knowledge of React&#10;- Experience with Node.js"
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Required Skills (comma separated)</label>
                            <input
                                type="text" name="skills" required
                                value={formData.skills} onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                placeholder="React, Node.js, Python, AWS"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg flex items-center justify-center transition shadow-lg shadow-blue-500/25"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} className="mr-2" /> Post Job</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
