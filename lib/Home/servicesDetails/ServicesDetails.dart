import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';
import '../../utils/constants.dart';
import '../appointments/BookAppointments.dart';

class ServicesDetailsScreen extends StatefulWidget {
  final String title;
  final String location;
  final String rating;
  final String reviews;
  final String imageUrl;
  final String tag;
  final String price;
  final List<Map<String, dynamic>>? mediaList;

   ServicesDetailsScreen({
    super.key,
    this.title = "Euphoria Spa & Beauty Lounge",
    this.location = "California, CA",
    this.rating = "4.4",
    this.reviews = "453",
    this.imageUrl =
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    this.tag = "Top Rated",
    this.price = "₹1,500.00",
    this.mediaList,
  });

  @override
  State<ServicesDetailsScreen> createState() => _ServicesDetailsScreenState();
}

class _ServicesDetailsScreenState extends State<ServicesDetailsScreen> {
  late ScrollController _scrollController;
  late PageController _pageController;
  double _appBarOpacity = 0.0;
  int _currentMediaIndex = 0;

  late final List<Map<String, dynamic>> _mediaItems;

  int _selectedPackageIndex = 0;
  bool _isWishlist = false;

  final List<String> _packages = ["Basic", "Standard", "Premium"];

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_onScroll);
    _pageController = PageController();

    _mediaItems = widget.mediaList ?? [
      {
        "type": "image",
        "url": widget.imageUrl,
      },
      {
        "type": "video",
        "url":
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        "videoUrl":
            "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        "type": "image",
        "url":
            "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
      },
      {
        "type": "image",
        "url":
            "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
      },
    ];
  }

  void _onScroll() {
    final double offset = _scrollController.offset;
    final double newOpacity = (offset / 180).clamp(0.0, 1.0);
    if ((newOpacity - _appBarOpacity).abs() > 0.01) {
      setState(() {
        _appBarOpacity = newOpacity;
      });
    }
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  void _playMediaVideo(BuildContext context, String videoUrl) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.black,
        insetPadding: const EdgeInsets.all(16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              alignment: Alignment.center,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: Image.network(
                      _mediaItems[_currentMediaIndex]["url"]!,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Container(
                  height: 200,
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.4),
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.play_circle_fill_rounded,
                      color: AppColors.primary,
                      size: 64,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      "Playing Preview Video",
                      style: FTextStyle.desc(context).copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close_rounded, color: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  final List<String> _packageDescriptions = [
    "Immerse yourself in tranquility with our Relaxation Retreat Package. Enjoy a soothing 60-minute Swedish Massage to melt away stress, followed by a Basic Cleansing Facial to refresh your skin. Complete your experience with a Classic Manicure and unwind in our sauna.",
    "Elevate your wellness with our Deluxe Renewal Package. Includes 90-minute Deep Tissue Massage, Hydrating Glow Facial, Gel Pedicure & Manicure, and complimentary Aromatherapy session for total body rejuvenation.",
    "The Ultimate VIP Luxury Experience. Includes 120-minute Hot Stone Therapy, 24K Gold Facial, Full Body Polish & Wrap, Salon Hair Spa, and Private Sauna & Steam Room Access."
  ];

  final List<String> _servicesIncluded = [
    "60-minute Swedish Massage",
    "Basic Cleansing Facial",
    "Classic Manicure",
    "Access to Sauna and Steam Rooms",
  ];

  final List<Map<String, String>> _beauticians = [
    {
      "name": "Aria Harris",
      "image":
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      "bgColor": "0xffEFE6FD",
    },
    {
      "name": "Sophia W.",
      "image":
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      "bgColor": "0xffE1F8F6",
    },
    {
      "name": "Ava Davis",
      "image":
          "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80",
      "bgColor": "0xffEFE6FD",
    },
    {
      "name": "Victoria L.",
      "image":
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      "bgColor": "0xffFDE6EC",
    },
  ];

  void _showShareBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _ShareServicesSheet(
        serviceTitle: widget.title,
        imageUrl: widget.imageUrl,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Scrollable Body
          SingleChildScrollView(
            controller: _scrollController,
            physics: const BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Top Hero Media Carousel Header (Images + Videos Slider)
                SizedBox(
                  height: 330,
                  width: double.infinity,
                  child: Stack(
                    children: [
                      // Swipeable Media PageView
                      PageView.builder(
                        controller: _pageController,
                        itemCount: _mediaItems.length,
                        onPageChanged: (index) {
                          setState(() {
                            _currentMediaIndex = index;
                          });
                        },
                        itemBuilder: (context, index) {
                          final media = _mediaItems[index];
                          final bool isVideo = media["type"] == "video";
                          final String img = media["url"] ?? widget.imageUrl;

                          return GestureDetector(
                            onTap: () {
                              if (isVideo) {
                                _playMediaVideo(
                                    context, media["videoUrl"] ?? "");
                              }
                            },
                            child: Stack(
                              fit: StackFit.expand,
                              children: [
                                Image.network(
                                  img,
                                  fit: BoxFit.cover,
                                ),
                                // Gradient Tint
                                const DecoratedBox(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: [
                                        Colors.black54,
                                        Colors.transparent,
                                        Colors.black38,
                                      ],
                                    ),
                                  ),
                                ),

                                // Video Play Overlay Icon
                                if (isVideo)
                                  Center(
                                    child: Container(
                                      width: 62,
                                      height: 62,
                                      decoration: BoxDecoration(
                                        color: Colors.black.withValues(alpha: 0.5),
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: Colors.white,
                                          width: 2.5,
                                        ),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black
                                                .withValues(alpha: 0.3),
                                            blurRadius: 12,
                                          ),
                                        ],
                                      ),
                                      child: const Icon(
                                        Icons.play_arrow_rounded,
                                        color: Colors.white,
                                        size: 40,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          );
                        },
                      ),

                      // Page Indicator Dots (Bottom Center)
                      Positioned(
                        bottom: 16,
                        left: 0,
                        right: 0,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(_mediaItems.length, (idx) {
                            final bool isCurrent = idx == _currentMediaIndex;
                            return AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              margin:
                                  const EdgeInsets.symmetric(horizontal: 3),
                              width: isCurrent ? 22 : 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: isCurrent
                                    ? AppColors.primary
                                    : Colors.white.withValues(alpha: 0.65),
                                borderRadius: BorderRadius.circular(10),
                              ),
                            );
                          }),
                        ),
                      ),

                      // Media Counter Pill (Bottom Right)
                      Positioned(
                        bottom: 14,
                        right: 16,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.6),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.2),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                _mediaItems[_currentMediaIndex]["type"] ==
                                        "video"
                                    ? Icons.videocam_rounded
                                    : Icons.photo_camera_rounded,
                                color: Colors.white,
                                size: 14,
                              ),
                              const SizedBox(width: 5),
                              Text(
                                "${_currentMediaIndex + 1}/${_mediaItems.length}",
                                style: FTextStyle.desc(context).copyWith(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // 2. Service Info Details Content
                Padding(
                  padding:  EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Tag Chip
                      Container(
                        padding:  EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.primaryLight,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          widget.tag,
                          style: FTextStyle.desc(context).copyWith(
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                       SizedBox(height: 4),
                      // Title
                      Text(
                        widget.title,
                        style: FTextStyle.header(context)
                      ),

                       SizedBox(height: 8),

                      // Location & Rating Row
                      Row(
                        children: [
                          Icon(
                            Icons.location_on_rounded,
                            color: AppColors.textSecondary,
                            size: 16,
                          ),
                           SizedBox(width: 4),
                          Text(
                            widget.location,
                            style: FTextStyle.desc(context),
                          ),
                           Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8),
                            child: Text(
                              "•",
                              style: TextStyle(color: AppColors.textSecondary),
                            ),
                          ),
                          Icon(
                            Icons.star_rounded,
                            color: AppColors.rating,
                            size: 18,
                          ),
                           SizedBox(width: 4),
                          Text(
                            "${widget.rating} (${widget.reviews})",
                            style: FTextStyle.rating(context)
                          ),
                        ],
                      ),

                       SizedBox(height: 8),

                      // Description Section
                      Text(
                        "Description",
                        style: FTextStyle.tittle(context),
                      ),
                       SizedBox(height: 5),
                      Text(
                        "Welcome to Serenity Spa & Beauty, your haven for relaxation, rejuvenation, and holistic wellness. Nestled in the heart of Tranquil Town, we offer a luxury sanctuary designed to soothe your body and mind.",
                        style: FTextStyle.desc(context)
                      ),

                       SizedBox(height: 4),

                      // Package Tabs (Basic, Standard, Premium)
                      Row(
                        children: List.generate(_packages.length, (index) {
                          final isSelected = _selectedPackageIndex == index;
                          return Expanded(
                            child: GestureDetector(
                              onTap: () {
                                setState(() {
                                  _selectedPackageIndex = index;
                                });
                              },
                              child: Container(
                                padding:
                                     EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  border: Border(
                                    bottom: BorderSide(
                                      color: isSelected
                                          ? AppColors.primary
                                          :  Color(0xFFE9E9ED),
                                      width: isSelected ? 1.4 : 1.0,
                                    ),
                                  ),
                                ),
                                child: Text(
                                  _packages[index],
                                  textAlign: TextAlign.center,
                                  style: FTextStyle.tittle(context)
                                ),
                              ),
                            ),
                          );
                        }),
                      ),

                       SizedBox(height: 6),

                      // Package Description Content
                      Text(
                        _packageDescriptions[_selectedPackageIndex],
                        style: FTextStyle.desc(context)
                      ),

                       SizedBox(height: 12),

                      // Service Included Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            Constants.servicesIncluded,
                            style: FTextStyle.tittle(context),
                          ),
                          Text(
                            Constants.seeAll,
                            style: FTextStyle.textButton(context),
                          ),
                        ],
                      ),

                       SizedBox(height: 14),

                      Column(
                        children: _servicesIncluded.map((service) {
                          return Padding(
                            padding:  EdgeInsets.only(bottom: 12),
                            child: Row(
                              children: [
                                Container(
                                  width: 20,
                                  height: 20,
                                  decoration:  BoxDecoration(
                                    color: Color(0xFF38C9A6),
                                    shape: BoxShape.circle,
                                  ),
                                  child:  Icon(
                                    Icons.check,
                                    color: Colors.white,
                                    size: 14,
                                  ),
                                ),
                                 SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    service,
                                    style: FTextStyle.desc(context)
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),

                       SizedBox(height: 8),

                      // Beautician Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            Constants.beautician,
                            style: FTextStyle.tittle(context),
                          ),
                          Text(
                            Constants.seeAll,
                            style: FTextStyle.textButton(context),
                          ),
                        ],
                      ),

                       SizedBox(height: 16),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: _beauticians.map((person) {
                          return Column(
                            children: [
                              Container(
                                width: 60,
                                height: 60,
                                decoration: BoxDecoration(
                                  color: Color(int.parse(person["bgColor"]!)),
                                  shape: BoxShape.circle,
                                ),
                                child: ClipOval(
                                  child: Image.network(
                                    person["image"]!,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                               SizedBox(height: 8),
                              Text(
                                person["name"]!,
                                style: FTextStyle.desc(context)
                              ),
                            ],
                          );
                        }).toList(),
                      ),

                       SizedBox(height: 18),

                      // Reviews Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "Reviews",
                            style: FTextStyle.header(context),
                          ),
                          Text(
                            Constants.seeAll,
                            style: FTextStyle.textButton(context),
                          ),
                        ],
                      ),

                       SizedBox(height: 16),

                      // Rating Card Container
                      Container(
                        padding:  EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color:  Color(0xFFEBEBEB)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.02),
                              blurRadius: 10,
                              offset:  Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            // Left Column Rating Big Number
                            Column(
                              children: [
                                Text(
                                  "4.0",
                                  style: FTextStyle.tittle(context).copyWith(
                                    fontSize: 42,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                 SizedBox(height: 4),
                                Text(
                                  "2342 Reviews",
                                  style: FTextStyle.desc(context).copyWith(
                                    color: AppColors.textSecondary,
                                    fontSize: 12,
                                  ),
                                ),
                                 SizedBox(height: 8),
                                Row(
                                  children: List.generate(5, (starIdx) {
                                    return Icon(
                                      Icons.star_rounded,
                                      size: 16,
                                      color: starIdx < 4
                                          ? AppColors.rating
                                          :  Color(0xFFDFE1E6),
                                    );
                                  }),
                                ),
                              ],
                            ),

                             SizedBox(width: 24),

                            // Right Progress Bars for 5 to 1 Stars
                            Expanded(
                              child: Column(
                                children: [
                                  _buildRatingBar(context, "5 star", 0.9),
                                  _buildRatingBar(context, "4 star", 0.75),
                                  _buildRatingBar(context, "3 star", 0.5),
                                  _buildRatingBar(context, "2 star", 0.3),
                                  _buildRatingBar(context, "1 star", 0.15),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                       SizedBox(height: 100), // Space for bottom bar
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Fixed Top App Bar Items (Smoothly turns white when image scrolls past)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 150),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: _appBarOpacity),
                boxShadow: _appBarOpacity > 0.5
                    ? [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.08),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ]
                    : [],
              ),
              child: SafeArea(
                child: Padding(
                  padding:  EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    children: [
                      // Circular Back Button
                      GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(
                            color: _appBarOpacity > 0.5
                                ?  Color(0xFFF2F3F6)
                                : Colors.white.withValues(alpha: 0.9),
                            shape: BoxShape.circle,
                            boxShadow: _appBarOpacity <= 0.5
                                ? [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.12),
                                      blurRadius: 8,
                                      offset:  Offset(0, 2),
                                    ),
                                  ]
                                : [],
                          ),
                          child: Icon(
                            Icons.arrow_back,
                            color: Color.lerp(
                              Colors.black,
                              AppColors.textPrimary,
                              _appBarOpacity,
                            ),
                            size: 20,
                          ),
                        ),
                      ),

                      // Centered Service Detail Title (Smoothly transitions white -> black)
                      Expanded(
                        child: Text(
                          Constants.services,
                          textAlign: TextAlign.center,
                          style: FTextStyle.header(context).copyWith(
                            color: Color.lerp(
                              Colors.white,
                              AppColors.textPrimary,
                              _appBarOpacity,
                            ),
                            fontWeight: FontWeight.bold,
                            shadows: _appBarOpacity < 0.5
                                ? [
                                     Shadow(
                                      color: Colors.black54,
                                      blurRadius: 8,
                                    ),
                                  ]
                                : [],
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),

                      // 3-Dots Popup Menu Button (Smoothly transitions white -> black)
                      PopupMenuButton<String>(
                        padding: EdgeInsets.zero,
                        icon: Icon(
                          Icons.more_vert,
                          color: Color.lerp(
                            Colors.white,
                            AppColors.textPrimary,
                            _appBarOpacity,
                          ),
                          size: 22,
                        ),
                        onSelected: (value) {
                          if (value == "share") {
                            _showShareBottomSheet();
                          } else if (value == "wishlist") {
                            setState(() {
                              _isWishlist = !_isWishlist;
                            });
                            CustomSnackBar.show(
                              context,
                              message: _isWishlist
                                  ? "Added to Wishlist ❤️"
                                  : "Removed from Wishlist",
                              icon: Icons.favorite_rounded,
                            );
                          }
                        },
                        itemBuilder: (context) => [
                           PopupMenuItem(
                            value: "share",
                            child: Row(
                              children: [
                                Icon(Icons.share_outlined, size: 20),
                                SizedBox(width: 10),
                                Text("Share"),
                              ],
                            ),
                          ),
                          PopupMenuItem(
                            value: "wishlist",
                            child: Row(
                              children: [
                                Icon(
                                  _isWishlist
                                      ? Icons.favorite
                                      : Icons.favorite_border,
                                  size: 20,
                                  color: _isWishlist
                                      ? AppColors.primary
                                      : null,
                                ),
                                const SizedBox(width: 10),
                                Text(_isWishlist
                                    ? "Remove Wishlist"
                                    : "Add to Wishlist"),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Bottom Fixed Action Bar (Book Now + Chat Icon)
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              padding:  EdgeInsets.fromLTRB(20, 14, 20, 24),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 16,
                    offset:  Offset(0, -4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: CustomButton(
                      text: "Book Now",
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => BookAppointmentsScreen(
                              serviceTitle: widget.title,
                              initialPackage: _packages[_selectedPackageIndex],
                              initialBeautician: _beauticians[0]["name"]!,
                              price: widget.price,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRatingBar(BuildContext context, String label, double value) {
    return Padding(
      padding:  EdgeInsets.symmetric(vertical: 2.5),
      child: Row(
        children: [
          Text(
            label,
            style: FTextStyle.desc(context),
          ),
           SizedBox(width: 8),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: value,
                minHeight: 6,
                backgroundColor:  Color(0xFFEAEAEA),
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.rating),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ShareServicesSheet extends StatelessWidget {
  final String serviceTitle;
  final String imageUrl;

   _ShareServicesSheet({
    required this.serviceTitle,
    required this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
     String shareLink =
        "blooms.com/detail/euphoria-spa-beauty-lounge";

    return Container(
      padding:  EdgeInsets.fromLTRB(24, 16, 24, 34),
      decoration:  BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Drag Handle
            Center(
              child: Container(
                width: 48,
                height: 5,
                decoration: BoxDecoration(
                  color:  Color(0xFFE0E1E6),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),

             SizedBox(height: 16),

            // Header Title + Close Icon
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Share this Services",
                  style: FTextStyle.header(context)
                ),
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child:  Icon(
                    Icons.close_rounded,
                    color: AppColors.black,
                    size: 24,
                  ),
                ),
              ],
            ),

             SizedBox(height: 10),
            // Service Snippet Card
            Container(
              padding:  EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color:AppColors.white),
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(
                      imageUrl,
                      width: 64,
                      height: 64,
                      fit: BoxFit.cover,
                    ),
                  ),
                   SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          serviceTitle,
                          style: FTextStyle.tittle(context).copyWith(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                         SizedBox(height: 6),
                        Row(
                          children: [
                             Icon(
                              Icons.location_on_rounded,
                              size: 14,
                              color: Color(0xFF9CA3B1),
                            ),
                             SizedBox(width: 2),
                            Expanded(
                              child: Text(
                                "123 Main Street,...",
                                style: FTextStyle.desc(context).copyWith(
                                  fontSize: 11,
                                  color:  Color(0xFF9CA3B1),
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                             Text(
                              "•",
                              style: TextStyle(color: Color(0xFF9CA3B1)),
                            ),
                             SizedBox(width: 4),
                             Icon(
                              Icons.star_rounded,
                              size: 14,
                              color: AppColors.rating,
                            ),
                             SizedBox(width: 2),
                            Text(
                              "4.8 (323)",
                              style: FTextStyle.rating(context),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Copy Link Box
            Container(
              padding:  EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color:  Color(0xFFF5F6F8),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppColors.border, // ya const Color(0xFFE0E1E6)
                  width: 1,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      shareLink,
                      style: FTextStyle.tittle(context),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                   SizedBox(width: 8),
                  ElevatedButton.icon(
                    onPressed: () {
                      Clipboard.setData( ClipboardData(text: shareLink));
                      Navigator.pop(context);
                      CustomSnackBar.show( context,
                        message: "Link copied to clipboard!",
                        icon: Icons.copy_rounded,
                      );
                    },
                    icon:  Icon(Icons.copy_rounded, size: 16),
                    label:  Text("Copy"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black87,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding:  EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                    ),
                  ),
                ],
              ),
            ),

             SizedBox(height: 24),

            // Social Share Icons Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildSocialIcon(
                  context,
                  icon: Icons.flutter_dash,
                  label: "Twitter",
                  color: Colors.black,
                ),
                _buildSocialIcon(
                  context,
                  icon: Icons.chat_rounded,
                  label: "WhatsApp",
                  color:  Color(0xFF25D366),
                ),
                _buildSocialIcon(
                  context,
                  icon: Icons.facebook,
                  label: "Facebook",
                  color:  Color(0xFF1877F2),
                ),
                _buildSocialIcon(
                  context,
                  icon: Icons.camera_alt_rounded,
                  label: "Instagram",
                  color:  Color(0xFFE4405F),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSocialIcon(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        CustomSnackBar.show(
          context,
          message: "Sharing to $label...",
          icon: icon,
        );
      },
      child: Column(
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 26,
            ),
          ),
           SizedBox(height: 8),
          Text(
            label,
            style: FTextStyle.desc(context).copyWith(
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
