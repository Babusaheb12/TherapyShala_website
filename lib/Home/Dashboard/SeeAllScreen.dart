import 'package:flutter/material.dart';
import '../../utils/flutter_color_themes.dart';
import '../../widget/custom_snackbar.dart';

class SeeAllScreen extends StatefulWidget {
  final String title;
  final List<Map<String, dynamic>> items;
  final String categoryType;

  const SeeAllScreen({
    super.key,
    required this.title,
    required this.items,
    this.categoryType = 'general',
  });

  @override
  State<SeeAllScreen> createState() => _SeeAllScreenState();
}

class _SeeAllScreenState extends State<SeeAllScreen> {
  final Set<String> _wishlist = {
    "Euphoria Spa & Beauty Lounge",
    "Swedish Relaxation Therapy",
  };

  final Map<String, Map<String, dynamic>> _cartItems = {};
  String _lastAddedCategory = "Service";
  String _lastAddedImage = "";
  String _searchQuery = "";
  String _selectedFilter = "All";

  int get _totalCartCount {
    int count = 0;
    _cartItems.forEach((key, value) {
      count += (value["quantity"] as int? ?? 1);
    });
    return count;
  }

  void _addToCart(Map<String, dynamic> item) {
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
          "category": widget.title,
        };
      }
      _lastAddedCategory = widget.title;
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

  List<Map<String, dynamic>> get _filteredItems {
    return widget.items.where((item) {
      final title = (item["title"] ?? item["name"] ?? "").toString().toLowerCase();
      final category = (item["category"] ?? item["speciality"] ?? "").toString().toLowerCase();
      final matchesSearch = title.contains(_searchQuery.toLowerCase()) ||
          category.contains(_searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (_selectedFilter == "Top Rated") {
        final rating = double.tryParse((item["rating"] ?? "0").toString()) ?? 0.0;
        return rating >= 4.8;
      }
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFAFAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 1,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          widget.title,
          style: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: false,
      ),
      body: Stack(
        children: [
          Column(
            children: [
              // Search & Filter Header Bar
              Container(
                color: Colors.white,
                padding: EdgeInsets.fromLTRB(16, 8, 16, 14),
                child: Column(
                  children: [
                    // Search Input Box
                    Container(
                      decoration: BoxDecoration(
                        color: Color(0xFFF4F5F7),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: TextField(
                        onChanged: (val) {
                          setState(() {
                            _searchQuery = val;
                          });
                        },
                        decoration: InputDecoration(
                          hintText: 'Search ${widget.title}...',
                          hintStyle: TextStyle(color: Color(0xFF9EA3B0), fontSize: 14),
                          prefixIcon: Icon(Icons.search_rounded, color: AppColors.textSecondary, size: 22),
                          suffixIcon: _searchQuery.isNotEmpty
                              ? IconButton(
                                  icon: Icon(Icons.clear_rounded, size: 18),
                                  onPressed: () {
                                    setState(() {
                                      _searchQuery = "";
                                    });
                                  },
                                )
                              : null,
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                    SizedBox(height: 12),
                    // Quick Filter Chips
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: ["All", "Top Rated", "Best Value", "Recommended"].map((filter) {
                          final isSelected = _selectedFilter == filter;
                          return Padding(
                            padding: EdgeInsets.only(right: 8),
                            child: ChoiceChip(
                              label: Text(filter),
                              selected: isSelected,
                              selectedColor: AppColors.primary,
                              backgroundColor: Color(0xFFF4F5F7),
                              labelStyle: TextStyle(
                                color: isSelected ? Colors.white : AppColors.textPrimary,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                fontSize: 12,
                              ),
                              onSelected: (selected) {
                                if (selected) {
                                  setState(() {
                                    _selectedFilter = filter;
                                  });
                                }
                              },
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                                side: BorderSide.none,
                              ),
                              showCheckmark: false,
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                ),
              ),

              // Items Grid View
              Expanded(
                child: _filteredItems.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.search_off_rounded, size: 64, color: Colors.grey[400]),
                            SizedBox(height: 12),
                            Text(
                              'No matching items found',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Try searching for something else',
                              style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      )
                    : GridView.builder(
                        padding: EdgeInsets.fromLTRB(16, 16, 16, _totalCartCount > 0 ? 80 : 24),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.72,
                          crossAxisSpacing: 14,
                          mainAxisSpacing: 14,
                        ),
                        itemCount: _filteredItems.length,
                        itemBuilder: (context, index) {
                          final item = _filteredItems[index];
                          return _buildGridCard(item);
                        },
                      ),
              ),
            ],
          ),

          // Floating Cart Bar
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

  Widget _buildGridCard(Map<String, dynamic> item) {
    final String title = item["title"] ?? item["name"] ?? "Item";
    final String subtitle = item["speciality"] ?? item["category"] ?? item["duration"] ?? item["distance"] ?? "";
    final String price = item["price"] ?? item["discountPrice"] ?? "₹800";
    final String imageUrl = item["imageUrl"] ??
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=300";
    final String rating = item["rating"] ?? "4.8";
    final isFav = _wishlist.contains(title);
    final int qty = _cartItems[title]?["quantity"] as int? ?? 0;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image with Wishlist Button & Rating Tag
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
                child: Image.network(
                  imageUrl,
                  width: double.infinity,
                  height: 120,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: GestureDetector(
                  onTap: () => _toggleWishlist(title),
                  child: Container(
                    padding: EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.9),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      isFav ? Icons.favorite_rounded : Icons.favorite_outline_rounded,
                      color: isFav ? Color(0xFFE04362) : Color(0xFF9EA3B0),
                      size: 18,
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 8,
                left: 8,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.star_rounded, color: Color(0xFFFFB800), size: 13),
                      SizedBox(width: 2),
                      Text(
                        rating,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 11,
                    color: AppColors.textSecondary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      price,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                    qty > 0
                        ? Container(
                            height: 28,
                            decoration: BoxDecoration(
                              color: Color(0xFF168821),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                InkWell(
                                  onTap: () => _removeFromCart(title),
                                  child: Padding(
                                    padding: EdgeInsets.symmetric(horizontal: 6),
                                    child: Icon(Icons.remove, color: Colors.white, size: 12),
                                  ),
                                ),
                                Text(
                                  '$qty',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 11,
                                  ),
                                ),
                                InkWell(
                                  onTap: () => _addToCart(item),
                                  child: Padding(
                                    padding: EdgeInsets.symmetric(horizontal: 6),
                                    child: Icon(Icons.add, color: Colors.white, size: 12),
                                  ),
                                ),
                              ],
                            ),
                          )
                        : InkWell(
                            onTap: () => _addToCart(item),
                            child: Container(
                              padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Color(0xFFE8F5E9),
                                border: Border.all(color: Color(0xFF168821).withValues(alpha: 0.4)),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                'ADD',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF168821),
                                ),
                              ),
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
                    backgroundImage: _lastAddedImage.isNotEmpty ? NetworkImage(_lastAddedImage) : null,
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
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        SizedBox(height: 2),
                        Text(
                          '$count ${count == 1 ? "service" : "services"} added',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.9),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        'View Cart',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(width: 2),
                      Icon(Icons.chevron_right_rounded, color: Colors.white, size: 20),
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
                                    _addToCart(item);
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
