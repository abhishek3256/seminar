import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { User, Mail, Phone, MapPin, Upload, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                if (user.role === 'student') {
                    const res = await api.get('/student/profile');
                    if (res.data?.success) {
                        setProfile(res.data.data);
                    } else {
                        setError(res.data?.message || 'Failed to load profile');
                    }
                } else if (user.role === 'company') {
                    const res = await api.get('/company/profile');
                    if (res.data?.success) {
                        setProfile(res.data.data);
                    } else {
                        setError(res.data?.message || 'Failed to load profile');
                    }
                } else {
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const displayName =
        profile?.fullName ||
        profile?.companyName ||
        user?.fullName ||
        user?.companyName ||
        user?.name ||
        user?.email ||
        'User';

    const phone =
        profile?.phone ||
        profile?.hrPhone ||
        '';

    const location =
        profile?.headquartersLocation ||
        profile?.currentLocation ||
        '';

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header / Cover */}
                <div className="relative h-48 rounded-xl bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-20"></div>
                </div>

                {/* Profile Info */}
                <div className="relative px-6 -mt-20">
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                            {profile?.profilePhoto || user?.profilePhoto ? (
                                <img
                                    src={profile?.profilePhoto || user.profilePhoto}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={64} className="text-slate-500" />
                            )}
                        </div>
                        <div className="flex-1 pb-4">
                            <h1 className="text-3xl font-bold text-white">{displayName}</h1>
                            <p className="text-slate-400 capitalize">{user?.role || 'student'}</p>
                        </div>
                        <div className="pb-4">
                            <button className="btn-primary flex items-center gap-2">
                                <Upload size={18} /> Update Resume
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mx-6 mt-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-4">Contact Info</h3>
                            <div className="space-y-4 text-slate-300">
                                <div className="flex items-center gap-3">
                                    <Mail size={18} className="text-slate-500" />
                                    <span>{user?.email || 'email@example.com'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="text-slate-500" />
                                    <span>{phone || 'Add your phone number'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-slate-500" />
                                    <span>{location || 'Add your location'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {(profile?.skills && profile.skills.length > 0
                                    ? profile.skills
                                    : ['React', 'Node.js', 'Python', 'Machine Learning', 'SQL']
                                ).map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <GraduationCap className="text-blue-400" /> Education
                            </h3>
                            <div className="space-y-6">
                                {profile?.branch || profile?.semester || profile?.currentCGPA ? (
                                    <div className="pl-4 border-l-2 border-slate-700">
                                        <h4 className="font-bold text-white">
                                            {profile.branch || 'Your Program'}
                                        </h4>
                                        <p className="text-slate-400 text-sm">
                                            Semester {profile.semester || '-'} • CGPA:{' '}
                                            {profile.currentCGPA || 'N/A'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="pl-4 border-l-2 border-slate-700">
                                        <h4 className="font-bold text-white">Add your education details</h4>
                                        <p className="text-slate-500 text-sm">
                                            Update your branch, semester, and CGPA to get better job matches.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Briefcase className="text-purple-400" /> Experience
                            </h3>
                            <div className="space-y-6">
                                {profile?.experience && profile.experience.length > 0 ? (
                                    profile.experience.map((exp, idx) => (
                                        <div key={idx} className="pl-4 border-l-2 border-slate-700">
                                            <h4 className="font-bold text-white">{exp.role}</h4>
                                            <p className="text-slate-400 text-sm">
                                                {exp.company} • {exp.duration}
                                            </p>
                                            {exp.description && (
                                                <p className="text-slate-500 mt-2 text-sm">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="pl-4 border-l-2 border-slate-700">
                                        <h4 className="font-bold text-white">Add your experience</h4>
                                        <p className="text-slate-500 text-sm">
                                            Showcase your internships, projects, or work experience here.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
