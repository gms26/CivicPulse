import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIssue } from '../api/issueApi';
import { Button, Card } from '../components/common';
import { MapPin, Image as ImageIcon, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportIssuePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'ROAD',
    locationAddress: '',
    description: '',
    latitude: 0.0,
    longitude: 0.0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        toast.success('Location detected! (Coordinates saved)');
      }, () => {
        toast.error('Unable to retrieve your location');
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("data", new Blob(
        [JSON.stringify(formData)],
        { type: "application/json" }
      ));
      
      if (imageFile) {
        payload.append("image", imageFile);
      }

      await createIssue(payload);
      toast.success('Issue reported successfully!');
      navigate('/citizen/dashboard');
    } catch (err) {
      toast.error('Failed to report issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Report a Civic Issue</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Help us build a better community by accurately reporting problems in your area.</p>
        </div>

        <Card className="p-8 md:p-10 shadow-2xl rounded-2xl border-0 ring-1 ring-black/5 bg-white backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="md:col-span-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                  placeholder="E.g. Large pothole on Main St"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  required
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all duration-200 outline-none"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="ROAD">Road & Infrastructure</option>
                  <option value="WATER">Water & Sanitation</option>
                  <option value="POWER">Power & Electricity</option>
                  <option value="GARBAGE">Garbage & Waste</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location Address</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="locationAddress"
                    required
                    className="flex-1 px-5 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                    placeholder="Street address or landmark"
                    value={formData.locationAddress}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 border border-gray-200 shadow-sm transition-all duration-200 flex items-center justify-center hover:text-primary"
                    title="Detect my coordinates"
                  >
                    <MapPin size={22} />
                  </button>
                </div>
                {formData.latitude !== 0 && (
                  <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-500" /> Location coordinates pinned successfully
                  </p>
                )}
              </div>

              <div className="md:col-span-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none resize-y"
                  placeholder="Provide detailed context about the issue..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Photographic Evidence</label>
                <div className="mt-2 flex justify-center px-6 pt-8 pb-10 border-2 border-gray-200 border-dashed rounded-xl bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all duration-300 relative">
                  <div className="space-y-2 text-center">
                    {imagePreview ? (
                      <div className="relative inline-block group/img">
                        <img src={imagePreview} alt="Preview" className="mx-auto max-h-64 object-cover rounded-xl shadow-lg ring-1 ring-black/5" />
                        <button 
                          type="button"
                          onClick={() => {setImageFile(null); setImagePreview('');}}
                          className="absolute -top-3 -right-3 bg-white text-red-500 rounded-full shadow-xl p-1.5 hover:scale-110 transition-transform hover:text-red-600"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                          <ImageIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-semibold text-primary hover:text-blue-700 focus-within:outline-none transition-colors">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto px-10 py-3.5 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 rounded-xl transition-all duration-200">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Processing...
                  </span>
                ) : 'Submit Issue Report'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
