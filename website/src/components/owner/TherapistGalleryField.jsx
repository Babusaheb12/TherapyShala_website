import { useRef } from 'react';
import { ImagePlus, Info, UploadCloud, X } from 'lucide-react';
import { resolveMediaUrl } from '../../utils/mediaUtils';

const MAX_GALLERY_IMAGES = 5;

export default function TherapistGalleryField({
  images = [],
  onUpload,
  onRemove,
  uploading = false,
}) {
  const fileInputRef = useRef(null);
  const firstEmptyIndex = images.length < MAX_GALLERY_IMAGES ? images.length : -1;

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7 space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#F35271] flex items-center justify-center">
            <ImagePlus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-[#0D0D12]">
              Gallery Images (5 Photos) <span className="text-[#F35271]">*</span>
              <Info className="w-4 h-4 text-[#F35271]" aria-label="At least 3 and no more than 5 photos are required" />
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Add 3 to 5 photos customers can view in the app.
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto px-3 py-2 rounded-full bg-gray-100 text-gray-600 text-xs sm:text-sm font-bold whitespace-nowrap">
          {images.length} of 5 Photos Uploaded
        </span>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={uploading || images.length >= MAX_GALLERY_IMAGES}
        className="hidden"
        onChange={onUpload}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: MAX_GALLERY_IMAGES }, (_, index) => {
          const image = images[index];
          const isFirstEmpty = index === firstEmptyIndex;

          if (image) {
            return (
              <div
                key={`gallery-image-${index}`}
                className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50"
              >
                <img
                  src={resolveMediaUrl(image)}
                  alt={`Therapist gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => onRemove(index)}
                  aria-label={`Remove gallery image ${index + 1}`}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#F35271] disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-bold">
                  Photo #{index + 1}
                </span>
              </div>
            );
          }

          return (
            <button
              key={`gallery-slot-${index}`}
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-wait ${
                isFirstEmpty
                  ? 'border-rose-300 bg-rose-50/40 text-[#F35271] hover:bg-rose-50'
                  : 'border-gray-200 bg-gray-50/30 text-gray-400 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isFirstEmpty ? (
                <>
                  <span className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <UploadCloud className="w-7 h-7" />
                  </span>
                  <span className="text-sm font-bold">
                    {uploading ? 'Uploading...' : 'Add Image'}
                  </span>
                  <span className="text-xs font-semibold">Slot #{index + 1}</span>
                </>
              ) : (
                <>
                  <span className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <ImagePlus className="w-6 h-6 text-gray-300" />
                  </span>
                  <span className="text-sm font-bold">Empty Slot</span>
                  <span className="text-xs">Slot #{index + 1}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <aside className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-4 sm:px-5 flex items-start gap-3 text-amber-800">
        <Info className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-bold">Mobile App Display</p>
          <p className="text-xs sm:text-sm mt-1 leading-relaxed">
            Photo #1 is shown as the lead image in customer searches. The remaining photos appear in the therapist gallery.
          </p>
        </div>
      </aside>
    </section>
  );
}
