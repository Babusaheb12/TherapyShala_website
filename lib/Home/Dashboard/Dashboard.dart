import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import '../../utils/flutter_color_themes.dart';
import '../../widget/custom_snackbar.dart';
import '../notifications/Notifications.dart';
import '../servicesDetails/ServicesDetails.dart';
import 'SeeAllScreen.dart';

class DashboardScreen extends StatefulWidget {
  DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {

  final List<Map<String, dynamic>> therapistCategories = [
    {
      "title": "Massage Therapist",
      "icon": Icons.spa_outlined,
    },
    {
      "title": "Beauty Therapist",
      "icon": Icons.face_retouching_natural_outlined,
    },
    {
      "title": "Hair Stylist",
      "icon": Icons.content_cut_outlined,
    },
    {
      "title": "Makeup Artist",
      "icon": Icons.brush_outlined,
    },
    {
      "title": "Nail Technician",
      "icon": Icons.back_hand_outlined,
    },
    {
      "title": "Skin Specialist",
      "icon": Icons.favorite_border,
    },
    {
      "title": "Wellness Therapist",
      "icon": Icons.self_improvement_outlined,
    },
    {
      "title": "Spa Therapist",
      "icon": Icons.hot_tub_outlined,
    },
  ];

  final List<Map<String, dynamic>> _topTherapists = [
    {
      "name": "Sarah Jenkins",
      "speciality": "Deep Tissue & Swedish",
      "rating": "4.9",
      "reviews": "142",
      "exp": "8 Yrs Exp",
      "price": "₹800/hr",
      "imageUrl":
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    },
    {
      "name": "Elena Rostova",
      "speciality": "Facial & Skin Care",
      "rating": "4.8",
      "reviews": "98",
      "exp": "6 Yrs Exp",
      "price": "₹650/hr",
      "imageUrl":
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    },
    {
      "name": "Dr. Michael Chen",
      "speciality": "Reflexology & Wellness",
      "rating": "4.9",
      "reviews": "210",
      "exp": "10 Yrs Exp",
      "price": "₹900/hr",
      "imageUrl":
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
    },
  ];

  final List<Map<String, dynamic>> _popularPackages = [
    {
      "title": "Full Body Detox Spa",
      "duration": "90 Mins",
      "includes": "Deep Tissue Massage + Head Spa + Steam",
      "originalPrice": "₹1,600",
      "discountPrice": "₹1,200",
      "badge": "25% OFF",
      "imageUrl":
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=300",
    },
    {
      "title": "Glow & Radiance Facial Combo",
      "duration": "60 Mins",
      "includes": "Hydrafacial + Detan Pack + Threading",
      "originalPrice": "₹1,100",
      "discountPrice": "₹850",
      "badge": "20% OFF",
      "imageUrl":
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=300",
    },
  ];

  final List<Map<String, dynamic>> _organicProducts = [
    {
      "name": "Organic Aromatherapy Oil Set",
      "category": "Essential Oils",
      "price": "₹249",
      "rating": "4.9",
      "imageUrl":
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=200",
    },
    {
      "name": "Herbal Body Polish & Scrub",
      "category": "Exfoliator",
      "price": "₹185",
      "rating": "4.8",
      "imageUrl":
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=200",
    },
    {
      "name": "Rosewater Hydrating Mist",
      "category": "Facial Toner",
      "price": "₹140",
      "rating": "4.7",
      "imageUrl":
          "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=200",
    },
  ];

  final List<Map<String, dynamic>> _clientReviews = [
    {
      "quote":
          "The therapist arrived right on time with a clean sanitized kit. Best deep tissue massage ever!",
      "name": "Sophia Martinez",
      "role": "Verified Client",
      "avatar":
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    },
    {
      "quote":
          "Super convenient home spa service. Loved the organic aromatherapy oils and soft background music.",
      "name": "David K.",
      "role": "Verified Client",
      "avatar":
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    },
  ];

  final List<Map<String, dynamic>> _mostBookedServices = [
    {
      "title": "Swedish Relaxation Therapy",
      "category": "Body Therapy",
      "rating": "4.9",
      "bookings": "1.4k+ Booked",
      "price": "₹1,299",
      "duration": "60 Mins",
      "tag": "Bestseller",
      "imageUrl":
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=300",
    },
    {
      "title": "Deep Tissue Healing Massage",
      "category": "Pain Relief",
      "rating": "4.8",
      "bookings": "980+ Booked",
      "price": "₹1,499",
      "duration": "75 Mins",
      "tag": "Top Rated",
      "imageUrl":
          "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=300",
    },
    {
      "title": "HydraGlow Facial & Head Spa",
      "category": "Skin & Glow",
      "rating": "4.9",
      "bookings": "1.1k+ Booked",
      "price": "₹999",
      "duration": "45 Mins",
      "tag": "Trending",
      "imageUrl":
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=300",
    },
  ];

  final List<Map<String, dynamic>> _trendingNearYou = [
    {
      "title": "Royal Ayurvedic Abhyanga",
      "distance": "0.8 km away",
      "rating": "4.9",
      "reviews": "230",
      "price": "₹1,199",
      "originalPrice": "₹1,500",
      "badge": "🔥 20% OFF",
      "imageUrl":
          "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=300",
    },
    {
      "title": "Aroma Candle Relief Therapy",
      "distance": "1.5 km away",
      "rating": "4.8",
      "reviews": "184",
      "price": "₹1,350",
      "originalPrice": "₹1,700",
      "badge": "⚡ Trending",
      "imageUrl":
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=300",
    },
    {
      "title": "Hot Stone Spa Treatment",
      "distance": "2.1 km away",
      "rating": "4.9",
      "reviews": "310",
      "price": "₹1,600",
      "originalPrice": "₹2,000",
      "badge": "🌟 Popular",
      "imageUrl":
          "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=300",
    },
  ];

  final List<Map<String, dynamic>> _nearbySalons = [
    {
      "title": "Euphoria Spa & Beauty Lounge",
      "price": "₹1,500",
      "rating": "4.4",
      "reviews": "453",
      "imageUrl":
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=300",
    },
    {
      "title": "Lumina Beauty Sanctuary",
      "price": "₹1,000",
      "rating": "4.4",
      "reviews": "453",
      "imageUrl":
          "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=300",
    },
    {
      "title": "Serenity Wellness Haven",
      "price": "₹1,200",
      "rating": "4.7",
      "reviews": "312",
      "imageUrl":
          "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=300",
    },
  ];

  final Set<String> _wishlist = {
    "Euphoria Spa & Beauty Lounge",
    "Swedish Relaxation Therapy",
  };

  final Map<String, Map<String, dynamic>> _cartItems = {};
  String _lastAddedCategory = "Salon For Women";
  String _lastAddedImage = "";

  int get _totalCartCount {
    int count = 0;
    _cartItems.forEach((key, value) {
      count += (value["quantity"] as int? ?? 1);
    });
    return count;
  }

  void _addToCart(Map<String, dynamic> item, {String category = "Salon For Women"}) {
    final String title = item["title"] ?? item["name"] ?? "Service";
    final String imageUrl = item["imageUrl"] ??
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=300";

    setState(() {
      if (_cartItems.containsKey(title)) {
        _cartItems[title]!["quantity"] = (_cartItems[title]!["quantity"] as int) + 1;
      } else {
        _cartItems[title] = {
          "title": title,
          "price": item["price"] ?? item["discountPrice"] ?? "₹999",
          "imageUrl": imageUrl,
          "quantity": 1,
          "category": category,
        };
      }
      _lastAddedCategory = category;
      _lastAddedImage = imageUrl;
    });

    CustomSnackBar.show(
      context,
      message: '$title added to cart',
      icon: Icons.shopping_bag_outlined,
      backgroundColor: Color(0xFF168821),
    );
  }

  void _removeFromCart(String title) {
    setState(() {
      if (_cartItems.containsKey(title)) {
        int currentQty = _cartItems[title]!["quantity"] as int;
        if (currentQty > 1) {
          _cartItems[title]!["quantity"] = currentQty - 1;
        } else {
          _cartItems.remove(title);
        }
      }
    });
  }

  void _toggleWishlist(String itemName) {
    setState(() {
      if (_wishlist.contains(itemName)) {
        _wishlist.remove(itemName);
        CustomSnackBar.show(
          context,
          message: '$itemName removed from Wishlist',
          icon: Icons.favorite_outline_rounded,
          backgroundColor: AppColors.textSecondary,
        );
      } else {
        _wishlist.add(itemName);
        CustomSnackBar.show(
          context,
          message: '$itemName added to Wishlist! ❤️',
          icon: Icons.favorite_rounded,
          backgroundColor: AppColors.primary,
        );
      }
    });
  }

  Widget _buildWishlistButton(String title) {
    final isFav = _wishlist.contains(title);
    return GestureDetector(
      onTap: () => _toggleWishlist(title),
      child: Container(
        padding: EdgeInsets.all(6),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.9),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 6,
            ),
          ],
        ),
        child: AnimatedSwitcher(
          duration: Duration(milliseconds: 200),
          child: Icon(
            isFav ? Icons.favorite_rounded : Icons.favorite_outline_rounded,
            key: ValueKey<bool>(isFav),
            color: isFav ? Color(0xFFE04362) : Color(0xFF9EA3B0),
            size: 18,
          ),
        ),
      ),
    );
  }

  Widget _buildAddToCartButton(Map<String, dynamic> item, {String category = "Salon For Women"}) {
    final String title = item["title"] ?? item["name"] ?? "Euphoria Spa & Beauty Lounge";
    final String location = item["location"] ?? item["distance"] ?? "California, CA";
    final String rating = item["rating"] ?? "4.4";
    final String reviews = item["reviews"] ?? item["bookings"] ?? "453";
    final String imageUrl = item["imageUrl"] ?? "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80";
    final String tag = item["tag"] ?? item["badge"] ?? item["speciality"] ?? "Top Rated";
    final String price = item["price"] ?? item["discountPrice"] ?? "₹1,500.00";

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ServicesDetailsScreen(
              title: title,
              location: location,
              rating: rating,
              reviews: reviews,
              imageUrl: imageUrl,
              tag: tag,
              price: price,
            ),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
        decoration: BoxDecoration(
          color: AppColors.primaryLight,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
        ),
        child: Text(
          'Details',
          style: FTextStyle.desc(context).copyWith(
            color: AppColors.primary,

          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFAFAFC),
      body: Stack(
        children: [
          SafeArea(
            child: _buildDashboardContent(),
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: _buildFloatingCartBar(),
          ),
        ],
      ),
    );
  }

  Widget _buildDashboardContent() {
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(20, 16, 20, _totalCartCount > 0 ? 80 : 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Header Row: User Info & Notification
          Row(
            children: [
              CircleAvatar(
                radius: 26,
                backgroundColor: Color(0xFFFFD6DD),
                backgroundImage: NetworkImage(
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                ),
              ),
              SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Hi, ${Constants.guest}',
                    style: FTextStyle.tittle(context)
                  ),
                  SizedBox(height: 2),
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        color: AppColors.primary,
                        size: 18,
                      ),
                      SizedBox(width: 4),
                      Text(
                        Constants.location,
                        style: FTextStyle.desc(context)
                      ),
                    ],
                  ),
                ],
              ),
              Spacer(),
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>  NotificationScreen(),
                    ),
                  );
                },
                child: Container(
                  width: 46,
                  height: 46,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    border: Border.all(color: Color(0xFFEBEBEB)),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Icon(
                        Icons.notifications_none_rounded,
                        color: AppColors.textPrimary,
                        size: 24,
                      ),
                      Positioned(
                        top: 11,
                        right: 13,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 18),

          // 5. Promotional Valentine's Banner
          Container(
            width: double.infinity,
            height: 160,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: LinearGradient(
                colors: [
                  AppColors.bannerColor1,
                  AppColors.bannerColor2,
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Stack(
              children: [
                Positioned(
                  right: 0,
                  top: 0,
                  bottom: 0,
                  child: ClipRRect(
                    borderRadius: BorderRadius.only(
                      topRight: Radius.circular(20),
                      bottomRight: Radius.circular(20),
                    ),
                    child: Image.network(
                      'https://istanbulhospitalhealth.com/wp-content/uploads/2024/09/4gt4v4.png',
                      fit: BoxFit.cover,
                      width: 140,
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: MediaQuery.of(context).size.width * 0.48,
                        child: Text(
                          Constants.bannerText,
                          style: FTextStyle.tittle(context).copyWith(
                            color: AppColors.white
                          )
                        ),
                      ),
                      SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: AppColors.primary,
                          elevation: 0,
                          padding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 6,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: Text(
                          'Book Now',
                          style: FTextStyle.onboardingButton(context).copyWith(
                            color: AppColors.black
                          )
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: 24),

          // 6. Service Categories Section
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
               Constants.serviceCategories,
                style: FTextStyle.header(context)
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SeeAllScreen(
                        title: Constants.serviceCategories,
                        items: therapistCategories,
                      ),
                    ),
                  );
                },
                child: Text(
                  Constants.seeAll,
                  style: FTextStyle.textButton(context)
                ),
              ),
            ],
          ),
          SizedBox(height: 2),

          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: BouncingScrollPhysics(),
            child: Row(
              children: therapistCategories.map((item) {
                return Padding(
                  padding: EdgeInsets.only(right: 16),
                  child: _buildCategoryItem(
                    icon: item["icon"] as IconData,
                    label: item["title"] as String,
                  ),
                );
              }).toList(),
            ),
          ),
          SizedBox(height: 10),
          // 7. Top Rated Therapists / Specialists Section
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                Constants.topRatedTherapists,
                  style: FTextStyle.header(context)
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SeeAllScreen(
                        title: Constants.topRatedTherapists,
                        items: _topTherapists,
                      ),
                    ),
                  );
                },
                child: Text(
                  Constants.viewAll,
                  style: FTextStyle.textButton(context)
                ),
              ),
            ],
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: BouncingScrollPhysics(),
            child: Row(
              children: _topTherapists.map((therapist) {
                return _buildTherapistCard(therapist);
              }).toList(),
            ),
          ),
          SizedBox(height: 24),

          // Most Booked Section
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                Constants.mostBook,
                  style: FTextStyle.header(context)
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SeeAllScreen(
                        title: Constants.mostBook,
                        items: _mostBookedServices,
                      ),
                    ),
                  );
                },
                child: Text(
                  Constants.viewAll,
                  style: FTextStyle.textButton(context)
                ),
              ),
            ],
          ),
          SizedBox(height: 2),

          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: BouncingScrollPhysics(),
            child: Row(
              children: _mostBookedServices.map((service) {
                return _buildMostBookedCard(service);
              }).toList(),
            ),
          ),
          SizedBox(height: 4),

          // 8. Popular Spa & Wellness Packages
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                Constants.popularPackages,
                style: FTextStyle.header(context)
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SeeAllScreen(
                        title: Constants.popularPackages,
                        items: _popularPackages,
                      ),
                    ),
                  );
                },
                child: Text(
                  Constants.exploreAll,
                  style: FTextStyle.textButton(context)
                ),
              ),
            ],
          ),
          SizedBox(height: 2),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: BouncingScrollPhysics(),
            child: Row(
              children: _popularPackages.map((package) {
                return _buildPackageCard(package);
              }).toList(),
            ),
          ),
          SizedBox(height: 4),

          // Trending Near You Section
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                Constants.trendingNearYou,
                style: FTextStyle.header(context)
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SeeAllScreen(
                        title: Constants.trendingNearYou,
                        items: _trendingNearYou,
                      ),
                    ),
                  );
                },
                child: Text(
                  Constants.explore,
                  style: FTextStyle.textButton(context)
                ),
              ),
            ],
          ),
          SizedBox(height: 2),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: BouncingScrollPhysics(),
            child: Row(
              children: _trendingNearYou.map((item) {
                return _buildTrendingCard(item);
              }).toList(),
            ),
          ),
          SizedBox(height: 24),

          // 9. Nearby Salons & Spas
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                Constants.nearbySalons,
                style: FTextStyle.header(context)
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SeeAllScreen(
                        title: Constants.nearbySalons,
                        items: _nearbySalons,
                      ),
                    ),
                  );
                },
                child: Text(
                  Constants.seeAll,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 2),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: BouncingScrollPhysics(),
            child: Row(
              children: [
                _buildServiceCard(
                  title: 'Euphoria Spa & Beauty Lounge',
                  price: '₹1,500',
                  rating: '4.4',
                  reviews: '453',
                  imageUrl:
                      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=300',
                ),
                _buildServiceCard(
                  title: 'Lumina Beauty Sanctuary',
                  price: '₹1,000',
                  rating: '4.4',
                  reviews: '453',
                  imageUrl:
                      'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=300',
                ),
                _buildServiceCard(
                  title: 'Serenity Wellness Haven',
                  price: '₹1,200',
                  rating: '4.7',
                  reviews: '312',
                  imageUrl:
                      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=300',
                ),
              ],
            ),
          ),
          SizedBox(height: 24),

          // 10. Organic Spa & Wellness Products Store
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                Constants.organicProducts,
                style: FTextStyle.header(context)
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SeeAllScreen(
                        title: Constants.organicProducts,
                        items: _organicProducts,
                      ),
                    ),
                  );
                },
                child: Text(
                  'Shop All',
                  style: FTextStyle.textButton(context)
                ),
              ),
            ],
          ),
          SizedBox(height: 2),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: BouncingScrollPhysics(),
            child: Row(
              children: _organicProducts.map((product) {
                return _buildProductCard(product);
              }).toList(),
            ),
          ),
          SizedBox(height: 14),

          // 11. What Our Clients Say (Testimonials)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                Constants.whatOurClientsSay,
                style: FTextStyle.header(context)
              ),
            ],
          ),
          SizedBox(height: 10),

          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: BouncingScrollPhysics(),
            child: Row(
              children: _clientReviews.map((review) {
                return _buildReviewCard(review);
              }).toList(),
            ),
          ),
          SizedBox(height: 10),

          // 12. Why Choose TherapyShala Trust Badges
          Container(
            padding: EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Color(0xFFEBEBEB)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  Constants.whyChooseTherapyShala,
                  style: FTextStyle.header(context)
                ),
                SizedBox(height: 4),
                Row(
                  children: [
                    Expanded(
                      child: _buildTrustItem(
                        emoji: '🛡️',
                        title: 'Verified Experts',
                        subtitle: 'Background checked',
                      ),
                    ),
                    Expanded(
                      child: _buildTrustItem(
                        emoji: '🧴',
                        title: '100% Hygienic',
                        subtitle: 'Sterilized kit',
                      ),
                    ),
                    Expanded(
                      child: _buildTrustItem(
                        emoji: '⏱️',
                        title: 'On-Time Service',
                        subtitle: 'Guaranteed arrival',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryItem({
    required IconData icon,
    required String label,
  }) {
    return Column(
      children: [
        Container(
          width: 52,
          height: 52,
          decoration: BoxDecoration(
            color: Color(0xFFFFEEF1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            color: AppColors.primary,
            size: 26,
          ),
        ),
        SizedBox(height: 8),
        SizedBox(
          width: 76,
          child: Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: FTextStyle.desc(context)
          ),
        ),
      ],
    );
  }

  Widget _buildTherapistCard(Map<String, dynamic> therapist) {
    final String name = therapist["name"];
    return Container(
      width: 170,
      margin: EdgeInsets.only(right: 14),
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: AppColors.border.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: Image.network(
                  therapist["imageUrl"],
                  width: double.infinity,
                  height: 135,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 8,
                left: 8,
                child: _buildWishlistButton(name),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.9),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.star_rounded,
                          color: Color(0xFFFFB800), size: 14),
                      SizedBox(width: 2),
                      Text(
                        therapist["rating"],
                        style: FTextStyle.rating(context)
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 10),
          Text(
            therapist["name"],
            style: FTextStyle.tittle(context),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          SizedBox(height: 2),
          Text(
            therapist["speciality"],
            style: FTextStyle.desc(context),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                therapist["price"],
                style: FTextStyle.price(context)
              ),
              _buildAddToCartButton(therapist, category: "Therapist Booking"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPackageCard(Map<String, dynamic> package) {
    final String title = package["title"];
    return Container(
      width: 280,
      margin: EdgeInsets.only(right: 14),
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 15,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: Image.network(
                  package["imageUrl"],
                  width: 90,
                  height: 90,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 6,
                left: 6,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    package["badge"],
                    style: FTextStyle.rating(context).copyWith(
                      color: Colors.white,

                    )
                  ),
                ),
              ),
              Positioned(
                bottom: 6,
                right: 6,
                child: _buildWishlistButton(title),
              ),
            ],
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  package["title"],
                  style: FTextStyle.tittle(context),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 4),
                Text(
                  '⏱️ ${package["duration"]} • ${package["includes"]}',
                  style: FTextStyle.desc(context),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Wrap(
                        crossAxisAlignment: WrapCrossAlignment.center,
                        spacing: 6,
                        children: [
                          Text(
                            package["discountPrice"],
                            style: FTextStyle.price(context),
                          ),
                          Text(
                            package["originalPrice"],
                            style: FTextStyle.originalPrice(context),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 4),
                    _buildAddToCartButton(package, category: "Spa Package"),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard({
    required String title,
    required String price,
    required String rating,
    required String reviews,
    required String imageUrl,
  }) {
    return Container(
      width: 175,
      margin: EdgeInsets.only(right: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image with Heart Icon Overlay
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: Image.network(
                  imageUrl,
                  width: 175,
                  height: 165,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 10,
                right: 10,
                child: _buildWishlistButton(title),
              ),
            ],
          ),
          SizedBox(height: 10),

          // Title Text (2 lines max)
          Text(
            title,
            style: FTextStyle.tittle(context),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          SizedBox(height: 8),

          // Price & Rating Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    price,
                    style: FTextStyle.price(context)
                  ),
                  Row(
                    children: [
                      Icon(
                        Icons.star_rounded,
                        color: Color(0xFFFFB800),
                        size: 14,
                      ),
                      SizedBox(width: 2),
                      Text(
                        rating,
                        style: FTextStyle.rating(context)
                      ),
                    ],
                  ),
                ],
              ),
              _buildAddToCartButton(
                {"title": title, "price": price, "imageUrl": imageUrl},
                category: "Salon For Women",
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildProductCard(Map<String, dynamic> product) {
    final String name = product["name"];
    return Container(
      width: 150,
      margin: EdgeInsets.only(right: 14),
      padding: EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Color(0xFFEBEBEB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  product["imageUrl"],
                  width: double.infinity,
                  height: 100,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 6,
                right: 6,
                child: _buildWishlistButton(name),
              ),
            ],
          ),
          SizedBox(height: 8),
          Text(
            product["name"],
            style: FTextStyle.tittle(context),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          SizedBox(height: 2),
          Text(
            product["category"],
            style: FTextStyle.desc(context)
          ),
          SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                product["price"],
                style: FTextStyle.price(context)
              ),
              _buildAddToCartButton(product, category: "Spa Product"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildReviewCard(Map<String, dynamic> review) {
    return Container(
      width: 280,
      margin: EdgeInsets.only(right: 14),
      padding: EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Color(0xFFEBEBEB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: List.generate(5, (i) {
              return Icon(
                Icons.star_rounded,
                color: Color(0xFFFFB800),
                size: 16,
              );
            }),
          ),
          SizedBox(height: 8),
          Text(
            '"${review["quote"]}"',
            style: FTextStyle.desc(context),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
          SizedBox(height: 12),
          Row(
            children: [
              CircleAvatar(
                radius: 14,
                backgroundImage: NetworkImage(review["avatar"]),
              ),
              SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    review["name"],
                    style: FTextStyle.tittle(context)
                  ),
                  Text(
                    review["role"],
                    style: FTextStyle.price(context)
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTrustItem({
    required String emoji,
    required String title,
    required String subtitle,
  }) {
    return Column(
      children: [
        Text(
          emoji,
          style: TextStyle(fontSize: 26),
        ),
        SizedBox(height: 6),
        Text(
          title,
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: FTextStyle.tittle(context).copyWith(
            fontSize:11,
            fontWeight: FontWeight.w500,

          )
        ),
        SizedBox(height: 2),
        Text(
          subtitle,
          textAlign: TextAlign.center,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: FTextStyle.desc(context).copyWith(
            fontSize: 10
          )
        ),
      ],
    );
  }

  Widget _buildMostBookedCard(Map<String, dynamic> service) {
    final String title = service["title"];
    return Container(
      width: 210,
      margin: EdgeInsets.only(right: 14),
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: Image.network(
                  service["imageUrl"],
                  width: double.infinity,
                  height: 115,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 8,
                left: 8,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    service["tag"],
                    style: FTextStyle.rating(context).copyWith(
                      color: AppColors.white
                    )
                  ),
                ),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: _buildWishlistButton(title),
              ),
            ],
          ),
          SizedBox(height: 10),
          Text(
            service["title"],
            style: FTextStyle.tittle(context),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          SizedBox(height: 4),
          Row(
            children: [
              Icon(Icons.local_fire_department_rounded,
                  color: Color(0xFFFF5E7E), size: 14),
              SizedBox(width: 4),
              Text(
                service["bookings"],
                style: FTextStyle.desc(context)
              ),
              Spacer(),
              Text(
                service["duration"],
                style: FTextStyle.desc(context)
              ),
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                service["price"],
                style: FTextStyle.price(context)
              ),
              _buildAddToCartButton(service, category: "Most Booked Service"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTrendingCard(Map<String, dynamic> item) {
    final String title = item["title"];
    return Container(
      width: 200,
      margin: EdgeInsets.only(right: 14),
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: Image.network(
                  item["imageUrl"],
                  width: double.infinity,
                  height: 115,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 8,
                left: 8,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Color(0xFF1F1D2B).withValues(alpha: 0.8),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    item["badge"],
                    style: FTextStyle.rating(context).copyWith(
                      color: AppColors.white
                    )
                  ),
                ),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: _buildWishlistButton(title),
              ),
            ],
          ),
          SizedBox(height: 10),
          Text(
            item["title"],
            style: FTextStyle.tittle(context),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          SizedBox(height: 4),
          Row(
            children: [
              Icon(Icons.near_me_rounded,
                  color: AppColors.primary, size: 13),
              SizedBox(width: 4),
              Text(
                item["distance"],
                style: FTextStyle.desc(context)
              ),
              Spacer(),
              Icon(Icons.star_rounded,
                  color: Color(0xFFFFB800), size: 14),
              SizedBox(width: 2),
              Text(
                item["rating"],
                style: FTextStyle.rating(context)
              ),
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Wrap(
                  crossAxisAlignment: WrapCrossAlignment.center,
                  spacing: 6,
                  children: [
                    Text(
                      item["price"],
                      style: FTextStyle.price(context),
                    ),
                    Text(
                      item["originalPrice"],
                      style: FTextStyle.originalPrice(context),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 4),
              _buildAddToCartButton(item, category: "Trending Service"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFloatingCartBar() {
    final int count = _totalCartCount;
    if (count == 0) return SizedBox.shrink();

    return SafeArea(
      child: Padding(
        padding: EdgeInsets.fromLTRB(16, 0, 16, 12),
        child: Material(
          elevation: 8,
          borderRadius: BorderRadius.circular(24),
          color: Color(0xFF168821),
          child: InkWell(
            borderRadius: BorderRadius.circular(24),
            onTap: _showCartBottomSheet,
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: Colors.white,
                    backgroundImage: _lastAddedImage.isNotEmpty
                        ? NetworkImage(_lastAddedImage)
                        : null,
                    child: _lastAddedImage.isEmpty
                        ? Icon(Icons.spa, color: Color(0xFF168821), size: 20)
                        : null,
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          _lastAddedCategory,
                          style: FTextStyle.tittle(context).copyWith(
                            color: AppColors.white,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        SizedBox(height: 2),
                        Text(
                          '$count ${count == 1 ? "service" : "services"} added',
                          style: FTextStyle.desc(context).copyWith(
                            color: AppColors.white
                          )
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        'View Cart',
                        style: FTextStyle.desc(context).copyWith(
                          color: AppColors.white
                        )
                      ),
                      SizedBox(width: 2),
                      Icon(
                        Icons.chevron_right_rounded,
                        color: Colors.white,
                        size: 20,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _showCartBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Your Cart 🛒',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    '$_totalCartCount Items',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              Divider(height: 24),
              Flexible(
                child: SingleChildScrollView(
                  child: Column(
                    children: _cartItems.values.map((item) {
                      return Padding(
                        padding: EdgeInsets.only(bottom: 12),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(
                                item["imageUrl"],
                                width: 44,
                                height: 44,
                                fit: BoxFit.cover,
                              ),
                            ),
                            SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item["title"],
                                    style: TextStyle(
                                      fontWeight: FontWeight.w700,
                                      fontSize: 13,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  Text(
                                    item["price"],
                                    style: TextStyle(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Row(
                              children: [
                                IconButton(
                                  icon: Icon(Icons.remove_circle_outline, size: 20),
                                  onPressed: () {
                                    _removeFromCart(item["title"]);
                                    Navigator.pop(context);
                                    if (_cartItems.isNotEmpty) {
                                      _showCartBottomSheet();
                                    }
                                  },
                                ),
                                Text(
                                  '${item["quantity"]}',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                IconButton(
                                  icon: Icon(Icons.add_circle_outline,
                                      size: 20, color: AppColors.primary),
                                  onPressed: () {
                                    _addToCart(item, category: item["category"]);
                                    Navigator.pop(context);
                                    _showCartBottomSheet();
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
              SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    CustomSnackBar.show(
                      context,
                      message: 'Proceeding to Checkout...',
                      icon: Icons.check_circle_outline,
                      backgroundColor: Color(0xFF168821),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF168821),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: Text(
                    'Proceed to Checkout',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
