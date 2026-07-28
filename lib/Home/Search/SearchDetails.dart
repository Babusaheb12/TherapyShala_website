import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import '../../utils/constants.dart';
import '../../widget/buttonWigiets.dart';
import '../../widget/custom_snackbar.dart';
import 'Search.dart';

typedef SearchDetailsScreenScreen = SearchDetailsScreen;

class SearchDetailsScreen extends StatefulWidget {
  final String? initialQuery;

  SearchDetailsScreen({super.key, this.initialQuery});

  @override
  State<SearchDetailsScreen> createState() => _SearchDetailsScreenState();
}

class _SearchDetailsScreenState extends State<SearchDetailsScreen> {
  late TextEditingController _searchController;
  String _selectedCategory = 'All Service';
  String _selectedLocation = 'Los Angeles, CA';
  double _minPrice = 50;
  double _maxPrice = 500;
  final Set<String> _wishlist = {};
  final TextEditingController minPriceController = TextEditingController();

  final TextEditingController maxPriceController = TextEditingController();

  final List<String> _categories = [
    'All Service',
    'Hair Cut',
    'Facial',
    'Waxing',
    'Massage',
    'Body Care',
  ];

  final List<Map<String, dynamic>> _allServices = [
    {
      "id": "1",
      "title": "Euphoria Spa & Beauty Lounge",
      "category": "Massage",
      "imageUrl":
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
      "rating": "4.8",
      "reviews": "453",
      "price": 150.0,
      "location": "Los Angeles, CA",
      "description":
          "Immerse yourself in tranquility with our Relaxation Retreat Package. Enjoy a soothing body massage.",
      "tag": "Recommendation",
    },
    {
      "id": "2",
      "title": "Lumina Beauty Sanctuary",
      "category": "Facial",
      "imageUrl":
          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=80",
      "rating": "4.6",
      "reviews": "312",
      "price": 120.0,
      "location": "Los Angeles, CA",
      "description":
          "Deep cleansing facial treatment with organic herbal oils and skin hydration.",
      "tag": "Top Rated",
    },
    {
      "id": "3",
      "title": "Glow Hair Salon & Spa",
      "category": "Hair Cut",
      "imageUrl":
          "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&q=80",
      "rating": "4.7",
      "reviews": "289",
      "price": 85.0,
      "location": "California, CA",
      "description":
          "Professional hair styling, haircut, and deep conditioning treatment.",
      "tag": "Trending",
    },
    {
      "id": "4",
      "title": "Serene Skin & Waxing Bar",
      "category": "Waxing",
      "imageUrl":
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
      "rating": "4.5",
      "reviews": "194",
      "price": 95.0,
      "location": "Los Angeles, CA",
      "description":
          "Pain-free full body chocolate waxing and skin polishing therapy.",
      "tag": "Best Value",
    },
    {
      "id": "5",
      "title": "Aroma Herbal Body Care",
      "category": "Body Care",
      "imageUrl":
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
      "rating": "4.9",
      "reviews": "512",
      "price": 200.0,
      "location": "Los Angeles, CA",
      "description":
          "Special body massage for complete stress relaxation right at your convenience.",
      "tag": "Recommendation",
    },
    {
      "id": "6",
      "title": "Royal Organic Facial Care",
      "category": "Facial",
      "imageUrl":
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
      "rating": "4.8",
      "reviews": "367",
      "price": 140.0,
      "location": "California, CA",
      "description":
          "Premium 24k Gold facial glow treatment for radiant and youthful skin.",
      "tag": "Popular",
    },
  ];

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController(text: widget.initialQuery ?? '');
    minPriceController.text = _minPrice.toInt().toString();
    maxPriceController.text = _maxPrice.toInt().toString();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> get _filteredServices {
    final query = _searchController.text.trim().toLowerCase();
    return _allServices.where((item) {
      final matchesQuery =
          query.isEmpty ||
          item["title"].toString().toLowerCase().contains(query) ||
          item["category"].toString().toLowerCase().contains(query) ||
          item["description"].toString().toLowerCase().contains(query);

      final matchesCategory =
          _selectedCategory == 'All Service' ||
          item["category"] == _selectedCategory;

      final itemPrice = (item["price"] as num).toDouble();
      final matchesPrice = itemPrice >= _minPrice && itemPrice <= _maxPrice;

      return matchesQuery && matchesCategory && matchesPrice;
    }).toList();
  }

  void _toggleWishlist(String id, String name) {
    setState(() {
      if (_wishlist.contains(id)) {
        _wishlist.remove(id);
        CustomSnackBar.show(
          context,
          message: '$name removed from Wishlist',
          icon: Icons.favorite_border_rounded,
        );
      } else {
        _wishlist.add(id);
        CustomSnackBar.show(
          context,
          message: '$name added to Wishlist ❤️',
          icon: Icons.favorite_rounded,
        );
      }
    });
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _FilterSheet(
        selectedCategory: _selectedCategory,
        selectedLocation: _selectedLocation,
        minPrice: _minPrice,
        maxPrice: _maxPrice,
        onApply: (category, location, minP, maxP) {
          setState(() {
            _selectedCategory = category;
            _selectedLocation = location;
            _minPrice = minP;
            _maxPrice = maxP;
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final results = _filteredServices;
    final recommendation = _allServices.firstWhere(
      (element) => element["tag"] == "Recommendation",
      orElse: () => _allServices.first,
    );

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: Icon(Icons.arrow_back, color: AppColors.black),
        ),
        title: Text(Constants.search, style: FTextStyle.loginHeading(context)),
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 20),
            child: Icon(
              Icons.shopping_bag_outlined,
              color: AppColors.black,
              size: 26,
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.fromLTRB(24, 16, 24, 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SearchField(
              withFilter: true,
              controller: _searchController,
              onChanged: (_) => setState(() {}),
              onClear: () => setState(() {}),
              onFilterTap: _showFilterSheet,
            ),
            SizedBox(height: 4),
            _buildCategoryTabs(),
            SizedBox(height: 16),
            if (_searchController.text.isEmpty &&
                _selectedCategory == 'All Service') ...[
              Text(
                Constants.serviceRecommendation,
                style: FTextStyle.header(context),
              ),
              SizedBox(height: 16),
              _buildRecommendationCard(recommendation),
              SizedBox(height: 12),
            ],
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(Constants.serviceFound, style: FTextStyle.header(context)),
                Text(
                  '${results.length} items',
                  style: FTextStyle.desc(context),
                ),
              ],
            ),
            SizedBox(height: 6),
            if (results.isEmpty)
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: Color(0xffFAFAFC),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Color(0xffE9E9ED)),
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.search_off_rounded,
                      size: 48,
                      color: Color(0xff9CA3B1),
                    ),
                    SizedBox(height: 12),
                    Text(
                      Constants.noServicesFound,
                      style: FTextStyle.tittle(context),
                    ),
                    SizedBox(height: 6),
                    Text(
                      Constants.trySearching,
                      textAlign: TextAlign.center,
                      style: FTextStyle.desc(
                        context,
                      ).copyWith(color: Color(0xff858B99), fontSize: 13),
                    ),
                    SizedBox(height: 16),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _searchController.clear();
                          _selectedCategory = 'All Service';
                          _minPrice = 50;
                          _maxPrice = 500;
                        });
                      },
                      child: Text(
                        Constants.resetFilters,
                        style: FTextStyle.desc(context).copyWith(
                          color: Color(0xffF25172),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              )
            else
              GridView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: results.length,
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.70,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemBuilder: (context, index) {
                  final item = results[index];
                  return _buildServiceCard(item);
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryTabs() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: BouncingScrollPhysics(),
      child: Row(
        children: _categories.map((cat) {
          final isSelected = _selectedCategory == cat;
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedCategory = cat;
              });
            },
            child: Container(
              margin: EdgeInsets.only(right: 10),
              padding: EdgeInsets.symmetric(horizontal: 18, vertical: 10),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : AppColors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: isSelected ? AppColors.white : AppColors.border,
                ),
              ),
              child: Text(
                cat,
                style: FTextStyle.desc(context).copyWith(
                  color: isSelected ? Colors.white : Color(0xff747A89),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildRecommendationCard(Map<String, dynamic> item) {
    final isFav = _wishlist.contains(item["id"]);
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: SizedBox(
        height: 340,
        width: double.infinity,
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.network(item["imageUrl"], fit: BoxFit.cover),
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.center,
                  end: Alignment.bottomCenter,
                  colors: [Colors.transparent, AppColors.black],
                ),
              ),
            ),
            Positioned(
              top: 16,
              left: 16,
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  item["tag"] ?? "Recommendation",
                  style: FTextStyle.desc(context).copyWith(color: Colors.white),
                ),
              ),
            ),
            Positioned(
              top: 12,
              right: 12,
              child: GestureDetector(
                onTap: () => _toggleWishlist(item["id"], item["title"]),
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: AppColors.white.withValues(alpha: 0.85),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    isFav ? Icons.favorite : Icons.favorite_border_rounded,
                    color: isFav ? AppColors.primary : AppColors.border,
                    size: 24,
                  ),
                ),
              ),
            ),
            Positioned(
              left: 18,
              right: 18,
              bottom: 18,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item["title"],
                    style: FTextStyle.tittle(
                      context,
                    ).copyWith(color: AppColors.white),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 10),
                  Row(
                    children: [
                      Text(
                        item["category"],
                        style: FTextStyle.desc(
                          context,
                        ).copyWith(color: AppColors.primaryLight),
                      ),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        child: Text(
                          '•',
                          style: TextStyle(color: Colors.white70),
                        ),
                      ),
                      Icon(
                        Icons.star_rounded,
                        color: AppColors.rating,
                        size: 20,
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${item["rating"]} (${item["reviews"]})',
                        style: FTextStyle.rating(
                          context,
                        ).copyWith(color: AppColors.rating),
                      ),
                      Spacer(),
                      Text(
                        '₹${(item["price"] as num).toInt()}',
                        style: FTextStyle.price(context),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceCard(Map<String, dynamic> item) {
    final isFav = _wishlist.contains(item["id"]);
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
            child: AspectRatio(
              aspectRatio: 1.25,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(item["imageUrl"], fit: BoxFit.cover),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: () => _toggleWishlist(item["id"], item["title"]),
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.85),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isFav
                              ? Icons.favorite
                              : Icons.favorite_border_rounded,
                          color: isFav ? AppColors.primary : AppColors.border,
                          size: 18,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item["title"],
                  style: FTextStyle.tittle(context),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      '₹${(item["price"] as num).toInt()}',
                      style: FTextStyle.price(context),
                    ),
                    Spacer(),
                    Icon(Icons.star_rounded, color: AppColors.rating, size: 16),
                    SizedBox(width: 2),
                    Text(item["rating"], style: FTextStyle.rating(context)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterSheet extends StatefulWidget {
  final String selectedCategory;
  final String selectedLocation;
  final double minPrice;
  final double maxPrice;
  final Function(
    String category,
    String location,
    double minPrice,
    double maxPrice,
  )
  onApply;

  _FilterSheet({
    required this.selectedCategory,
    required this.selectedLocation,
    required this.minPrice,
    required this.maxPrice,
    required this.onApply,
  });

  @override
  State<_FilterSheet> createState() => _FilterSheetState();
}

class _FilterSheetState extends State<_FilterSheet> {
  late String _category;
  late String _location;
  late double _min;
  late double _max;

  final List<String> _locations = [
    'Los Angeles, CA',
    'California, CA',
    'New York, NY',
    'Miami, FL',
  ];

  final List<String> _filterCategories = [
    'All Service',
    'Hair Cut',
    'Facial',
    'Waxing',
    'Massage',
    'Body Care',
  ];

  late TextEditingController minController;
  late TextEditingController maxController;

  @override
  void initState() {
    super.initState();
    _category = widget.selectedCategory;
    _location = widget.selectedLocation;
    _min = widget.minPrice;
    _max = widget.maxPrice;
    minController = TextEditingController(text: _min.toInt().toString());
    maxController = TextEditingController(text: _max.toInt().toString());
  }

  @override
  void dispose() {
    minController.dispose();
    maxController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(24, 12, 24, 34),
      decoration: BoxDecoration(
        color: AppColors.primaryLight,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 50,
                height: 5,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 20),
            Center(
              child: Text(
                Constants.filters,
                style: FTextStyle.loginHeading(context),
              ),
            ),
            SizedBox(height: 4),
            _label(context, 'Location'),
            SizedBox(height: 10),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.border),
                borderRadius: BorderRadius.circular(16),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _location,
                  isExpanded: true,
                  icon: Icon(
                    Icons.keyboard_arrow_down_rounded,
                    color: AppColors.border,
                  ),
                  items: _locations.map((loc) {
                    return DropdownMenuItem(
                      value: loc,
                      child: Text(
                        loc,
                        style: FTextStyle.textfieldHintText(context),
                      ),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _location = val);
                  },
                ),
              ),
            ),
            SizedBox(height: 20),
            _label(context, Constants.category),
            SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _filterCategories.map((cat) {
                final isSelected = _category == cat;
                return GestureDetector(
                  onTap: () => setState(() => _category = cat),
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.primary : AppColors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: isSelected ? AppColors.white : AppColors.border,
                      ),
                    ),
                    child: Text(
                      cat,
                      style: FTextStyle.desc(context).copyWith(
                        color: isSelected
                            ? AppColors.white
                            : AppColors.textSecondary,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            //  SizedBox(height: 20),
            // Row(
            //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
            //   children: [
            //     _label(context, Constants.priceRange),
            //     Text(
            //       '₹${_min.toInt()} - ₹${_max.toInt()}',
            //       style: FTextStyle.desc(context).copyWith(
            //         color:  Color(0xffF25172),
            //         fontWeight: FontWeight.bold,
            //       ),
            //     ),
            //   ],
            // ),
            // RangeSlider(
            //   values: RangeValues(_min, _max),
            //   min: 0,
            //   max: 500,
            //   divisions: 50,
            //   activeColor:  Color(0xffF25172),
            //   inactiveColor:  Color(0xffE0E1E6),
            //   onChanged: (values) {
            //     setState(() {
            //       _min = values.start;
            //       _max = values.end;
            //     });
            //   },
            // ),
            //  SizedBox(height: 24),
            SizedBox(height: 20),

            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Price Minimum",
                          style: FTextStyle.tittle(context)
                      ),

                      SizedBox(height: 10),

                      TextFormField(
                        controller: minController,
                        textAlign: TextAlign.center,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          hintText: "100",
                          prefixText: "₹ ",
                          prefixStyle: FTextStyle.tittle(context).copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppColors.black,
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 10,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: BorderSide(color: AppColors.border),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: BorderSide(color: AppColors.border),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: BorderSide(
                              color: AppColors.primary,
                              width: 1.5,
                            ),
                          ),
                        ),
                        onChanged: (value) {
                          _min = double.tryParse(value.replaceAll('₹', '').trim()) ?? 0;
                        },
                      ),
                    ],
                  ),
                ),

                SizedBox(width: 16),

                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Price Maximum",
                        style: FTextStyle.tittle(context)

                      ),

                      SizedBox(height: 10),

                      TextFormField(
                        controller: maxController,
                        textAlign: TextAlign.center,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          hintText: "200",
                          prefixText: "₹ ",
                          prefixStyle: FTextStyle.tittle(context).copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppColors.black,
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 10,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: BorderSide(color: AppColors.border),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: BorderSide(color: AppColors.border),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: BorderSide(
                              color: AppColors.primary,
                              width: 1.5,
                            ),
                          ),
                        ),
                        onChanged: (value) {
                          _max = double.tryParse(value.replaceAll('₹', '').trim()) ?? 0;
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: CustomButton(
                text: Constants.applyFilters,
                onPressed: () {
                  widget.onApply(_category, _location, _min, _max);
                  Navigator.pop(context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _label(BuildContext context, String value) => Text(
    value,
    style: FTextStyle.tittle(context)
  );
}
