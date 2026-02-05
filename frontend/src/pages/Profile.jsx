import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({});

    // Form state - initially empty, filled on load
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        branch: '',
        skills: '',
        bio: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/student/profile');
                if (res.data.success) {
                    const student = res.data.data;
                    setUser(student); // Store full student object

                    // Populate form
                    setFormData({
                        fullName: student.fullName || '',
                        email: student.userId?.email || '', // Depending on how populate works, might be student.userId.email
                        phone: student.phone || '',
                        branch: student.branch || '',
                        skills: Array.isArray(student.skills) ? student.skills.join(', ') : (student.skills || ''),
                        bio: student.bio || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            // Convert skills string back to array if needed by backend, but backend logic allows update
            // Check studentController updateProfile logic. It takes raw body.
            // If skills expected as array, split.
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim())
            };

            const res = await api.put('/student/profile', payload);

            if (res.data.success) {
                setUser(res.data.data);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-40 pb-8 px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        My Profile
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your account information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6"
                    >
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl font-bold">{formData.fullName?.charAt(0) || 'U'}</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-1">{formData.fullName}</h2>
                            <p className="text-slate-400 mb-4">{formData.branch ? `${formData.branch} Student` : 'Student'}</p>

                            <div className="space-y-3 text-sm text-left">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Mail size={16} />
                                    <span className="truncate">{formData.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Phone size={16} />
                                    <span>{formData.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Briefcase size={16} />
                                    <span>{user.rollNumber || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Profile Information</h3>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                            >
                                {isEditing ? <><Save size={16} /> Save</> : <><Edit2 size={16} /> Edit</>}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Branch</label>
                                    <input
                                        type="text"
                                        value={formData.branch}
                                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    disabled={!isEditing}
                                    rows={3}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Skills</label>
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Comma separated skills"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
