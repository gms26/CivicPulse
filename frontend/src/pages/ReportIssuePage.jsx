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
      await createIssue(formData, imageFile);
      toast.success('Issue reported successfully!');
      navigate('/citizen/dashboard');
    } catch (err) {
      toast.error('Failed to report issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Report a Civic Issue</h1>
        <p className="text-gray-500 text-sm mt-1">Help us improve the community by reporting problems.</p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                placeholder="E.g. Large pothole on Main St"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary bg-white"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="locationAddress"
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                  placeholder="Street address or landmark"
                  value={formData.locationAddress}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Detect my coordinates"
                >
                  <MapPin size={20} />
                </button>
              </div>
              {formData.latitude !== 0 && (
                <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle size={10} /> Coordinates saved
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                placeholder="Provide more details about the issue..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo Evidence</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors relative">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="mx-auto h-48 object-cover rounded-md" />
                      <button 
                        type="button"
                        onClick={() => {setImageFile(null); setImagePreview('');}}
                        className="absolute -top-2 -right-2 bg-white text-danger rounded-full shadow-md p-1"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto min-w-[150px]">
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
