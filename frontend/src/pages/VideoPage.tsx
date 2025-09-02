import React, { useState } from 'react';
import { mockVideos } from '../services/mockData';
import VideoPlayer from '../components/VideoPlayer';
import { Play, Eye, Heart, Clock, User } from 'lucide-react';

const VideoPage: React.FC = () => {
  const [videos] = useState(mockVideos);
  const [selectedVideo, setSelectedVideo] = useState(mockVideos[0]);
  const [loading] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Videos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch the latest gaming content, tutorials, and entertainment from our community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            {selectedVideo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <VideoPlayer video={selectedVideo} />
                
                {/* Video Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {selectedVideo.description}
                  </p>
                  
                  {/* Video Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatViews(selectedVideo.views)} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{selectedVideo.likes.length} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(selectedVideo.duration)}</span>
                    </div>
                  </div>
                  
                  {/* Creator Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedVideo.owner.profilePic}
                        alt={selectedVideo.owner.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedVideo.owner.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(selectedVideo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video List */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              More Videos
            </h3>
            
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video._id}
                  onClick={() => setSelectedVideo(video)}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedVideo?._id === video._id ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-3">
                                    <h4 className="font-medium text-gray-900 text-sm mb-1 overflow-hidden text-ellipsis display-webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical">
                  {video.title}
                </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      <span>{video.owner.username}</span>
                      <span>•</span>
                      <span>{formatViews(video.views)} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
