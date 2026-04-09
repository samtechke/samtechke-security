import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiArrowLeft, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { supabase } from '../../supabase/client';

const ManageProjects = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });

  const BUCKET_NAME = 'project-images';

  // Fetch projects from Firebase
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsRef = collection(db, 'projects');
      const querySnapshot = await getDocs(projectsRef);
      const projectsData = [];
      querySnapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase Storage
  const uploadImageToSupabase = async (file) => {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `projects/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);
    
    if (error) {
      console.error("Supabase upload error:", error);
      throw error;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    return publicUrl;
  };

  // Delete image from Supabase Storage
  const deleteImageFromSupabase = async (imageUrl) => {
    if (!imageUrl) return;
    
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `projects/${fileName}`;
      
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = '';
      
      if (selectedImage) {
        imageUrl = await uploadImageToSupabase(selectedImage);
      } else if (editingProject && editingProject.image) {
        imageUrl = editingProject.image;
      }
      
      if (!imageUrl && !editingProject) {
        toast.error('Please select an image');
        setUploading(false);
        return;
      }
      
      if (editingProject) {
        // Update existing project
        const projectRef = doc(db, 'projects', editingProject.id);
        await updateDoc(projectRef, {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          image: imageUrl,
          updatedAt: new Date().toISOString()
        });
        toast.success('Project updated successfully!');
      } else {
        // Add new project
        await addDoc(collection(db, 'projects'), {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          image: imageUrl,
          createdAt: new Date().toISOString()
        });
        toast.success('Project added successfully!');
      }
      
      setIsModalOpen(false);
      setEditingProject(null);
      setFormData({ title: '', description: '', date: '' });
      setSelectedImage(null);
      setImagePreview('');
      fetchProjects(); // Refresh list
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error('Failed to save project');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      date: project.date
    });
    setImagePreview(project.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Delete image from Supabase
        if (imageUrl) {
          await deleteImageFromSupabase(imageUrl);
        }
        
        // Delete document from Firebase
        await deleteDoc(doc(db, 'projects', id));
        toast.success('Project deleted successfully!');
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
            >
              <FiArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Projects</h1>
          </div>
          <button
            onClick={() => {
              setEditingProject(null);
              setFormData({ title: '', description: '', date: '' });
              setSelectedImage(null);
              setImagePreview('');
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Project
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500">No projects yet. Click "Add Project" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100"
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                  <p className="text-primary font-semibold text-sm mb-4">{project.date}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.image)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal with Image Upload */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Project Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="e.g., Electric Fence - Karen"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="Describe the project..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Project Image</label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-40 mx-auto rounded"
                      />
                    ) : (
                      <div>
                        <FiUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Click to upload image</p>
                        <p className="text-gray-400 text-sm">JPG, PNG, GIF accepted</p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full btn-primary justify-center"
                >
                  {uploading ? 'Uploading...' : (editingProject ? 'Update' : 'Add') + ' Project'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;