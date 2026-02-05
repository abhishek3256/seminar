import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '+91 98765 43210',
        location: user.location || 'Bangalore, India',
        role: user.role || 'Full Stack Developer',
        experience: user.experience || '3 years',
        bio: user.bio || 'Passionate developer with expertise in modern web technologies.',
        skills: user.skills || 'React, Node.js, MongoDB, Python, AWS'
    });

    const handleSave = () => {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
    };

    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-8">
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
                                <span className="text-4xl font-bold">{formData.name?.charAt(0) || 'U'}</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-1">{formData.name}</h2>
                            <p className="text-slate-400 mb-4">{formData.role}</p>

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
                                    <MapPin size={16} />
                                    <span>{formData.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Briefcase size={16} />
                                    <span>{formData.experience}</span>
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
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Experience</label>
                                    <input
                                        type="text"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
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

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
                >
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Saved Jobs</p>
                                <p className="text-3xl font-bold text-blue-400 mt-1">{savedJobs.length}</p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Briefcase className="text-blue-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Applications</p>
                                <p className="text-3xl font-bold text-green-400 mt-1">12</p>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <Calendar className="text-green-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Profile Views</p>
                                <p className="text-3xl font-bold text-purple-400 mt-1">47</p>
                            </div>
                            <div className="p-3 bg-purple-500/20 rounded-lg">
                                <User className="text-purple-400" size={24} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
