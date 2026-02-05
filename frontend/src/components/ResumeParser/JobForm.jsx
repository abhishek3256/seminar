import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Code, FileText, ChevronRight, AlertCircle, Sparkles, ChevronDown, ChevronUp, Wand2, Loader2, X, Check } from 'lucide-react';
import axios from 'axios';
import { commonJobTitles, commonSkills, commonCompanies } from '../../data/jobData';

// --- Internal Helper Components ---

const AutocompleteInput = ({ label, value, onChange, options, placeholder, error, onBlur }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const query = e.target.value;
        onChange(query);

        if (query.trim().length > 0) {
            const filtered = options.filter(opt =>
                opt.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 8); // Limit to top 8 results
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelect = (option) => {
        onChange(option);
        setShowSuggestions(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input
                type="text"
                className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-300' : 'border-gray-200'} focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 placeholder-gray-400`}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={onBlur} // Pass onBlur if needed
                onFocus={() => { if (value) handleChange({ target: { value } }) }} // Show suggestions on click if value exists
            />
            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                    >
                        {suggestions.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(option)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-700 text-sm border-b border-gray-50 last:border-none flex items-center justify-between group"
                            >
                                {option}
                                <Check size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

const TagInput = ({ label, subLabel, value, onChange, options, placeholder, error, icon: Icon }) => {
    // value is a comma-separated string "React, Node"
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    const tags = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const query = e.target.value;
        setInputValue(query);

        if (query.trim().length > 0) {
            // Filter options that are NOT already selected
            const filtered = options.filter(opt =>
                opt.toLowerCase().includes(query.toLowerCase()) &&
                !tags.includes(opt)
            ).slice(0, 8);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const addTag = (tag) => {
        const newTags = [...tags, tag];
        onChange(newTags.join(', '));
        setInputValue("");
        setShowSuggestions(false);
    };

    const removeTag = (tagToRemove) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        onChange(newTags.join(', '));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue.trim());
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-gray-400 font-normal">{subLabel}</span>
            </label>

            <div className={`w-full px-3 py-2 rounded-xl border ${error ? 'border-red-300' : 'border-gray-200'} focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all bg-white min-h-[50px] flex flex-wrap gap-2`}>
                {tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900 transition-colors">
                            <X size={14} />
                        </button>
                    </span>
                ))}

                <input
                    type="text"
                    className="flex-1 min-w-[120px] outline-none text-gray-900 placeholder-gray-400 bg-transparent h-8"
                    placeholder={tags.length === 0 ? placeholder : ""}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (inputValue) setShowSuggestions(true); }}
                />
            </div>

            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto left-0"
                    >
                        {suggestions.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => addTag(option)}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 text-sm border-b border-gray-50 last:border-none flex items-center justify-between group"
                            >
                                <span className="flex items-center gap-2">
                                    {Icon && <Icon size={14} className="text-blue-400" />} {option}
                                </span>
                                <Check size={14} className="text-blue-500 opacity-0 group-hover:opacity-100" />
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};


const AccordionItem = ({ title, icon: Icon, isOpen, onClick, children, error }) => {
    return (
        <div className={`border rounded-xl mb-4 overflow-hidden transition-colors ${isOpen ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 bg-white'}`}>
            <button
                type="button"
                onClick={onClick}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className={`font-semibold ${isOpen ? 'text-blue-700' : 'text-gray-700'}`}>{title}</h3>
                        {error && <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5"><AlertCircle size={10} /> {error}</span>}
                    </div>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4 pt-0 border-t border-blue-100/50">
                            <div className="mt-4 space-y-4">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const JobForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        companyName: initialData?.companyName || '',
        jobTitle: initialData?.jobTitle || '',
        experienceLevel: initialData?.experienceLevel || '1-3 years',
        jobDescription: initialData?.jobDescription || '',
        requiredSkills: initialData?.requiredSkills || '',
        niceToHaveSkills: initialData?.niceToHaveSkills || ''
    });

    const [activeAccordion, setActiveAccordion] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
        if (!formData.jobDescription.trim()) newErrors.jobDescription = 'Job description is required';
        if (formData.jobDescription.length < 50) newErrors.jobDescription = 'Min 50 chars required';
        if (!formData.requiredSkills.trim()) newErrors.requiredSkills = 'Required skills are needed';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        } else {
            if (errors.jobTitle) setActiveAccordion(0);
            else if (errors.requiredSkills) setActiveAccordion(1);
            else if (errors.jobDescription) setActiveAccordion(2);
        }
    };

    const handleGenerateDescription = async () => {
        if (!formData.jobTitle || !formData.requiredSkills) {
            setErrors(prev => ({ ...prev, genError: 'Title & Skills required first' }));
            return;
        }
        setErrors(prev => ({ ...prev, genError: null }));
        setIsGenerating(true);

        try {
            const response = await axios.post('http://localhost:5001/api/resume/generate-description', {
                jobTitle: formData.jobTitle,
                requiredSkills: formData.requiredSkills,
                experienceLevel: formData.experienceLevel
            });

            if (response.data.success) {
                setFormData(prev => ({ ...prev, jobDescription: response.data.description }));
                setActiveAccordion(2); // Auto-open description tab
            }
        } catch (err) {
            setErrors(prev => ({ ...prev, genError: 'Failed to generate. Try again.' }));
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-50 rounded-lg">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Job Details</h2>
                    <p className="text-gray-500">Define the role to find the perfect match</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>

                {/* Accordion 1: Job Basics */}
                <AccordionItem
                    title="Role Information"
                    icon={Briefcase}
                    isOpen={activeAccordion === 0}
                    onClick={() => setActiveAccordion(activeAccordion === 0 ? -1 : 0)}
                    error={errors.jobTitle}
                >
                    <AutocompleteInput
                        label="Company Name"
                        placeholder="e.g. Google, Microsoft, Amazon..."
                        value={formData.companyName}
                        onChange={(val) => setFormData({ ...formData, companyName: val })}
                        options={commonCompanies}
                    />

                    <AutocompleteInput
                        label="Job Title"
                        placeholder="e.g. Senior Frontend Developer"
                        value={formData.jobTitle}
                        onChange={(val) => setFormData({ ...formData, jobTitle: val })}
                        options={commonJobTitles}
                        error={errors.jobTitle}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-gray-900"
                            value={formData.experienceLevel}
                            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        >
                            <option>0-1 years</option>
                            <option>1-3 years</option>
                            <option>3-5 years</option>
                            <option>5-8 years</option>
                            <option>8+ years</option>
                        </select>
                    </div>
                </AccordionItem>

                {/* Accordion 2: Skills */}
                <AccordionItem
                    title="Required Skills"
                    icon={Code}
                    isOpen={activeAccordion === 1}
                    onClick={() => setActiveAccordion(activeAccordion === 1 ? -1 : 1)}
                    error={errors.requiredSkills}
                >
                    <TagInput
                        label="Required Skills"
                        subLabel="(comma separated)"
                        placeholder="Type and press enter or select..."
                        value={formData.requiredSkills}
                        onChange={(val) => setFormData({ ...formData, requiredSkills: val })}
                        options={commonSkills}
                        error={errors.requiredSkills}
                        icon={Code}
                    />

                    <TagInput
                        label="Nice-to-Have Skills"
                        subLabel="(optional)"
                        placeholder="Add extra skills..."
                        value={formData.niceToHaveSkills}
                        onChange={(val) => setFormData({ ...formData, niceToHaveSkills: val })}
                        options={commonSkills}
                        icon={Sparkles}
                    />
                </AccordionItem>

                {/* Accordion 3: Description */}
                <AccordionItem
                    title="Job Description"
                    icon={FileText}
                    isOpen={activeAccordion === 2}
                    onClick={() => setActiveAccordion(activeAccordion === 2 ? -1 : 2)}
                    error={errors.jobDescription}
                >
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
                        <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={isGenerating || !formData.jobTitle}
                            className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-purple-100"
                        >
                            {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                            {isGenerating ? 'Generating...' : 'Auto-Generate with AI'}
                        </button>
                    </div>

                    {errors.genError && <p className="text-xs text-red-500 mb-2 bg-red-50 p-2 rounded-lg">{errors.genError}</p>}

                    <textarea
                        className={`w-full px-4 py-3 rounded-xl border ${errors.jobDescription ? 'border-red-300' : 'border-gray-200'} focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none min-h-[200px] text-gray-900 placeholder-gray-400 leading-relaxed`}
                        placeholder="Paste the job description or generate it with AI..."
                        value={formData.jobDescription}
                        onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">
                        {formData.jobDescription.length} characters
                    </div>
                </AccordionItem>

                <button
                    type="submit"
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                    Next: Upload Resume <ChevronRight size={20} />
                </button>
            </form>
        </motion.div>
    );
};

export default JobForm;
