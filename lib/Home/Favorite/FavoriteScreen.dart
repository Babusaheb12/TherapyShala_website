import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import '../../utils/constants.dart';
import '../servicesDetails/ServicesDetails.dart';

class FavoriteScreen extends StatefulWidget {
  FavoriteScreen({super.key});

  @override
  State<FavoriteScreen> createState() => _FavoriteScreenState();
}

class _FavoriteScreenState extends State<FavoriteScreen> {
  String _selectedCategory = "All Service";
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";

  final List<String> _categories = [
    "All Service",
    "Hair Cut",
    "Facial",
    "Waxing",
    "Massage",
    "Body Care",
  ];

  final List<Map<String, dynamic>> _favoriteItems = [
    {
      "id": "1",
      "title": "Special Body Massage for Relaxation from Home",
      "category": "Body Care",
      "rating": 4.4,
      "reviews": 453,
      "price": "₹1,500.00",
      "location": "California, CA",
      "image": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
      "isFavorite": true,
    },
    {
      "id": "2",
      "title": "Hydra Facial & Glow Treatment Care",
      "category": "Facial",
      "rating": 4.8,
      "reviews": 320,
      "price": "₹1,200.00",
      "location": "California, CA",
      "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "isFavorite": true,
    },
    {
      "id": "3",
      "title": "Professional Hair Cut & Styling Package",
      "category": "Hair Cut",
      "rating": 4.6,
      "reviews": 215,
      "price": "₹800.00",
      "location": "California, CA",
      "image": "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
      "isFavorite": true,
    },
    {
      "id": "4",
      "title": "Full Body Organic Waxing Treatment",
      "category": "Waxing",
      "rating": 4.5,
      "reviews": 180,
      "price": "₹1,100.00",
      "location": "California, CA",
      "image": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
      "isFavorite": true,
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> get _filteredItems {
    return _favoriteItems.where((item) {
      final matchesCategory = _selectedCategory == "All Service" ||
          item["category"] == _selectedCategory;
      final matchesSearch = _searchQuery.isEmpty ||
          item["title"]
              .toString()
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()) ||
          item["category"]
              .toString()
              .toLowerCase()
              .contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && item["isFavorite"] == true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredItems;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        automaticallyImplyLeading: false, // Back icon removed as requested
        title: Text(
          "Favorite",
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
        // actions: [
        //   IconButton(
        //     icon: Icon(
        //       Icons.more_vert_rounded,
        //       color: Colors.black,
        //       size: 24,
        //     ),
        //     onPressed: () {},
        //   ),
        //   SizedBox(width: 8),
        // ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Bar
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Container(
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: (value) {
                    setState(() {
                      _searchQuery = value;
                    });
                  },
                  decoration: InputDecoration(
                    hintText: Constants.search,
                    hintStyle: FTextStyle.textfieldHintText(context),
                    prefixIcon: Icon(
                      Icons.search_rounded,
                      color: AppColors.textSecondary,
                      size: 22,
                    ),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: Icon(
                              Icons.close_rounded,
                              color: AppColors.textSecondary,
                              size: 20,
                            ),
                            onPressed: () {
                              _searchController.clear();
                              setState(() {
                                _searchQuery = "";
                              });
                            },
                          )
                        : null,
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ),

            SizedBox(height: 2),

            // Category Horizontal List
            SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: EdgeInsets.symmetric(horizontal: 20),
                itemCount: _categories.length,
                itemBuilder: (context, index) {
                  final category = _categories[index];
                  final isSelected = category == _selectedCategory;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedCategory = category;
                      });
                    },
                    child: Container(
                      margin: EdgeInsets.only(right: 10),
                      padding: EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.primary
                            : Colors.white,
                        borderRadius: BorderRadius.circular(25),
                        border: Border.all(
                          color: isSelected
                              ? AppColors.primary
                              : AppColors.border,
                        ),
                      ),
                      child: Text(
                        category,
                        style: FTextStyle.tittle(context).copyWith(
                          color: isSelected
                              ? Colors.white
                              : AppColors.textSecondary,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            SizedBox(height: 12),
            // Main Favorite Items List
            Expanded(
              child: filtered.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.favorite_border_rounded,
                            size: 64,
                            color: AppColors.border,
                          ),
                          SizedBox(height: 12),
                          Text(
                            "No Favorites Found",
                            style: FTextStyle.textfieldHintText(context)
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      itemCount: filtered.length,
                      itemBuilder: (context, index) {
                        final item = filtered[index];
                        return _buildFavoriteCard(context, item);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFavoriteCard(BuildContext context, Map<String, dynamic> item) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ServicesDetailsScreen(
              title: item["title"],
              imageUrl: item["image"],
              price: item["price"],
            ),
          ),
        );
      },
      child: Container(
        margin: EdgeInsets.only(bottom: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Stack
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: Image.network(
                    item["image"],
                    height: 190,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      height: 190,
                      color: Color(0xFFF4F5F7),
                      child: Center(
                        child: Icon(Icons.image_not_supported, color: Colors.grey),
                      ),
                    ),
                  ),
                ),
                // Favorite Heart Button (Top Right)
                Positioned(
                  top: 14,
                  right: 14,
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        item["isFavorite"] = !(item["isFavorite"] as bool);
                      });
                    },
                    child: Container(
                      padding: EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black12,
                            blurRadius: 4,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Icon(
                        item["isFavorite"] == true
                            ? Icons.favorite_rounded
                            : Icons.favorite_border_rounded,
                        color: AppColors.primary,
                        size: 20,
                      ),
                    ),
                  ),
                ),
                // Price Badge (Bottom Right)
                Positioned(
                  bottom: 14,
                  right: 14,
                  child: Container(
                    padding: EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Color(0xFFFFF0F3),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      item["price"],
                      style: FTextStyle.price(context)
                    ),
                  ),
                ),
              ],
            ),

            SizedBox(height: 12),

            // Category & Rating Row
            Row(
              children: [
                Text(
                  item["category"],
                  style: FTextStyle.desc(context)
                ),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 6),
                  child: Text(
                    "•",
                    style: FTextStyle.desc(context)
                  ),
                ),
                Icon(
                  Icons.star_rounded,
                  color: AppColors.rating,
                  size: 18,
                ),
                SizedBox(width: 4),
                Text(
                  "${item["rating"]}",
                  style: FTextStyle.rating(context)
                ),
                SizedBox(width: 4),
                Text(
                  "(${item["reviews"]})",
                  style: FTextStyle.desc(context)
                ),
              ],
            ),

            SizedBox(height: 6),

            // Title
            Text(
              item["title"],
              style: FTextStyle.tittle(context),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),

            SizedBox(height: 6),

            // Location Row
            Row(
              children: [
                Icon(
                  Icons.location_on_rounded,
                  color: AppColors.textSecondary,
                  size: 16,
                ),
                SizedBox(width: 4),
                Text(
                  item["location"],
                  style: FTextStyle.desc(context)
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
