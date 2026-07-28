import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import '../../utils/constants.dart';
import '../../utils/flutter_color_themes.dart';
import 'SearchDetails.dart';

class SearchScreen extends StatefulWidget {
   SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final List<String> _recentSearches = [
    'Clinic',
    'Salon',
    'Facial Treatment',
    'Spa Beauty',
    'Beauty Clinic',
  ];

  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _navigateToDetails([String? query]) {
    final search = query ?? _searchController.text;
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => SearchDetailsScreen(initialQuery: search),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        title: Text(Constants.search,
            style: FTextStyle.loginHeading(context)),
        actions: [
          Padding(
            padding:  EdgeInsets.only(right: 20),
            child: Icon(
              Icons.shopping_bag_outlined,
              color: Colors.black,
              size: 26,
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding:  EdgeInsets.fromLTRB(24, 16, 24, 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SearchField(
              controller: _searchController,
              onChanged: (_) => setState(() {}),
              onSubmitted: (val) {
                if (val.trim().isNotEmpty) {
                  if (!_recentSearches.contains(val.trim())) {
                    setState(() {
                      _recentSearches.insert(0, val.trim());
                    });
                  }
                  _navigateToDetails(val.trim());
                }
              },
              onClear: () => setState(() {}),
            ),
             SizedBox(height: 14),
            if (_recentSearches.isNotEmpty) ...[
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Recent Search', style: FTextStyle.header(context)),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _recentSearches.clear();
                      });
                    },
                    child: Text(
                      'Clear All',
                      style: FTextStyle.textButton(context)
                    ),
                  ),
                ],
              ),
               SizedBox(height: 14),
              Wrap(
                spacing: 10,
                runSpacing: 12,
                children: _recentSearches.map((search) {
                  return _SearchChip(
                    label: search,
                    onTap: () => _navigateToDetails(search),
                    onDelete: () {
                      setState(() {
                        _recentSearches.remove(search);
                      });
                    },
                  );
                }).toList(),
              ),
               SizedBox(height: 32),
            ],
            Text('Recently Viewed', style: FTextStyle.header(context)),
             SizedBox(height: 16),
            _RecentlyViewedCard(
              imageUrl:
                  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=300&q=80',
              title: 'Euphoria Spa & Beauty Lounge',
              price: '₹1,500',
              rating: '4.4',
              reviews: '453',
              onTap: () => _navigateToDetails('Euphoria Spa'),
            ),
             SizedBox(height: 14),
            _RecentlyViewedCard(
              imageUrl:
                  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=300&q=80',
              title: 'Lumina Beauty Sanctuary',
              price: '₹1,000',
              rating: '4.5',
              reviews: '312',
              onTap: () => _navigateToDetails('Lumina Beauty'),
            ),
             SizedBox(height: 14),
            _RecentlyViewedCard(
              imageUrl:
                  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80',
              title: 'Glow & Radiance Facial Sanctuary',
              price: '₹850',
              rating: '4.8',
              reviews: '190',
              onTap: () => _navigateToDetails('Facial'),
            ),
          ],
        ),
      ),
    );
  }
}

class SearchField extends StatelessWidget {
  final bool withFilter;
  final TextEditingController? controller;
  final FocusNode? focusNode;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onTap;
  final VoidCallback? onFilterTap;
  final VoidCallback? onClear;
  final bool readOnly;
  final String hintText;

   SearchField({
    super.key,
    this.withFilter = false,
    this.controller,
    this.focusNode,
    this.onChanged,
    this.onSubmitted,
    this.onTap,
    this.onFilterTap,
    this.onClear,
    this.readOnly = false,
    this.hintText = 'Search services, salons...',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      padding:  EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color:  Color(0xffE9E9ED)),
        borderRadius: BorderRadius.circular(16),
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
          GestureDetector(
            onTap: () {
              if (onSubmitted != null && controller != null) {
                onSubmitted!(controller!.text);
              }
            },
            child:  Icon(Icons.search, color: Color(0xff9CA3B1), size: 26),
          ),
           SizedBox(width: 12),
          Expanded(
            child: TextField(
              controller: controller,
              focusNode: focusNode,
              readOnly: readOnly,
              onTap: onTap,
              onChanged: onChanged,
              onSubmitted: onSubmitted,
              textInputAction: TextInputAction.search,
              style: FTextStyle.desc(context).copyWith(
                color: Colors.black,
                fontSize: 15,
                fontWeight: FontWeight.w500,
              ),
              decoration: InputDecoration(
                hintText: hintText,
                hintStyle: FTextStyle.textfieldHintText(context),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
          if (controller != null && controller!.text.isNotEmpty) ...[
            GestureDetector(
              onTap: () {
                controller!.clear();
                if (onClear != null) onClear!();
              },
              child:  Icon(Icons.close_rounded, color: Color(0xff9CA3B1), size: 20),
            ),
             SizedBox(width: 8),
          ],
          if (withFilter) ...[
             SizedBox(
              height: 24,
              child: VerticalDivider(
                color: Color(0xffE9E9ED),
                thickness: 1,
              ),
            ),
             SizedBox(width: 10),
            GestureDetector(
              onTap: onFilterTap,
              child:  Icon(
                Icons.tune_rounded,
                color: Color(0xff9CA3B1),
                size: 24,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _SearchChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final VoidCallback onDelete;

   _SearchChip({
    required this.label,
    required this.onTap,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color:  Color(0xffFAFAFC),
        border: Border.all(color:AppColors.border),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          InkWell(
            onTap: onTap,
            borderRadius:  BorderRadius.only(
              topLeft: Radius.circular(24),
              bottomLeft: Radius.circular(24),
            ),
            child: Padding(
              padding:  EdgeInsets.fromLTRB(14, 8, 6, 8),
              child: Text(
                label,
                style: FTextStyle.desc(context)
              ),
            ),
          ),
          InkWell(
            onTap: onDelete,
            borderRadius:  BorderRadius.only(
              topRight: Radius.circular(24),
              bottomRight: Radius.circular(24),
            ),
            child:  Padding(
              padding: EdgeInsets.fromLTRB(2, 8, 12, 8),
              child: Icon(Icons.close, size: 16, color: Color(0xff858B99)),
            ),
          ),
        ],
      ),
    );
  }
}

class _RecentlyViewedCard extends StatelessWidget {
  final String imageUrl;
  final String title;
  final String price;
  final String rating;
  final String reviews;
  final VoidCallback onTap;

   _RecentlyViewedCard({
    required this.imageUrl,
    required this.title,
    required this.price,
    required this.rating,
    required this.reviews,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding:  EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color:  Color(0xffE9E9ED)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 12,
              offset:  Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                imageUrl,
                width: 90,
                height: 90,
                fit: BoxFit.cover,
              ),
            ),
             SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: FTextStyle.tittle(context),
                  ),
                   SizedBox(height: 10),
                  Row(
                    children: [
                      Text(
                        price,
                        style: FTextStyle.price(context)
                      ),
                       Spacer(),
                       Icon(
                        Icons.star_rounded,
                        color: AppColors.rating,
                        size: 18,
                      ),
                       SizedBox(width: 2),
                      Text(
                        rating,
                        style: FTextStyle.rating(context)
                      ),
                      Text(
                        ' ($reviews)',
                        style: FTextStyle.rating(context)
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
}
