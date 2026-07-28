import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'MyBookingDetails.dart';

class MyBookingScreen extends StatefulWidget {
  final bool showBackButton;

   MyBookingScreen({
    super.key,
    this.showBackButton = false,
  });

  @override
  State<MyBookingScreen> createState() => _MyBookingScreenState();
}

class _MyBookingScreenState extends State<MyBookingScreen> {
  int _selectedTabIndex = 0; // 0: My Booking, 1: History

  final List<Map<String, dynamic>> _activeBookings = [
    {
      "title": "Euphoria Spa & Beauty",
      "location": "California, CA",
      "rating": "4.8 (123)",
      "package": "Basic",
      "date": "Dec 22, 2024",
      "price": "₹1,500.00",
      "status": "On Going",
      "imageUrl":
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
    },
    {
      "title": "Lumina Beauty Sanctuary",
      "location": "California, CA",
      "rating": "4.8 (123)",
      "package": "Basic",
      "date": "Dec 22, 2024",
      "price": "₹1,500.00",
      "status": "On Going",
      "imageUrl":
          "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=400&q=80",
    },
    {
      "title": "Euphoria Spa & Beauty",
      "location": "California, CA",
      "rating": "4.8 (123)",
      "package": "Basic",
      "date": "Dec 22, 2024",
      "price": "₹1,500.00",
      "status": "On Going",
      "imageUrl":
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // backgroundColor: Colors.white,
      appBar: AppBar(
        // backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          "My Bookings",
          style: FTextStyle.header(context)
        ),
        centerTitle: false,
        actions: [
          IconButton(
            onPressed: () {},
            icon: Container(
              padding:  EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child:  Icon(
                Icons.calendar_month_rounded,
                color: AppColors.primary,
                size: 20,
              ),
            ),
          ),
           SizedBox(width: 4),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
             SizedBox(height: 2),

            // Segmented Tab Switcher (My Booking / History)
            Padding(
              padding:  EdgeInsets.symmetric(horizontal: 10),
              child: Container(
                padding:  EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color:  Color(0xFFF5F6F8),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color:  AppColors.border),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedTabIndex = 0;
                          });
                        },
                        child: AnimatedContainer(
                          duration:  Duration(milliseconds: 200),
                          padding:  EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _selectedTabIndex == 0
                                ? AppColors.primary
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            "My Booking",
                            textAlign: TextAlign.center,
                            style: FTextStyle.tittle(context).copyWith(
                              color: _selectedTabIndex == 0
                                  ? Colors.white
                                  : AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedTabIndex = 1;
                          });
                        },
                        child: AnimatedContainer(
                          duration:  Duration(milliseconds: 200),
                          padding:  EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _selectedTabIndex == 1
                                ? AppColors.primary
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            "History",
                            textAlign: TextAlign.center,
                            style: FTextStyle.tittle(context).copyWith(
                              color: _selectedTabIndex == 1
                                  ? Colors.white
                                  : AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

             SizedBox(height: 16),

            // Main Tab Body Content
            Expanded(
              child: _selectedTabIndex == 0
                  ? _buildMyBookingList()
                  : _buildHistoryEmptyState(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMyBookingList() {
    return ListView.builder(
      padding:  EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      itemCount: _activeBookings.length,
      itemBuilder: (context, index) {
        final booking = _activeBookings[index];
        return GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => MyBookingDetailsScreen(
                  serviceTitle: booking["title"],
                  imageUrl: booking["imageUrl"],
                  package: booking["package"],
                  bookingDate: booking["date"],
                  price: booking["price"],
                ),
              ),
            );
          },
          child: Container(
            margin:  EdgeInsets.only(bottom: 16),
            padding:  EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color:  Color(0xFFEBEBEB)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 10,
                  offset:  Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                // Top Row: Thumbnail + Info
                Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(14),
                      child: Image.network(
                        booking["imageUrl"],
                        width: 76,
                        height: 76,
                        fit: BoxFit.cover,
                      ),
                    ),
                     SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            booking["title"],
                            style: FTextStyle.tittle(context),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                           SizedBox(height: 4),
                          Row(
                            children: [
                               Icon(
                                Icons.location_on_outlined,
                                color: Color(0xFF9CA3B1),
                                size: 14,
                              ),
                               SizedBox(width: 2),
                              Text(
                                booking["location"],
                                style: FTextStyle.desc(context)
                              ),
                               Text(" • "),
                               Icon(
                                Icons.star_rounded,
                                color: AppColors.rating,
                                size: 14,
                              ),
                               SizedBox(width: 2),
                              Text(
                                booking["rating"],
                                style: FTextStyle.rating(context)
                              ),
                            ],
                          ),
                           SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "Package",
                                style: FTextStyle.desc(context)
                              ),
                              Text(
                                booking["package"],
                                style: FTextStyle.tittle(context)
                              ),
                            ],
                          ),
                           SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "Date",
                                style: FTextStyle.desc(context)
                              ),
                              Text(
                                booking["date"],
                                style: FTextStyle.tittle(context)
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                 SizedBox(height: 6),
                 Divider(color: Color(0xFFEBEBEB), thickness: 1),
                 SizedBox(height: 8),

                // Bottom Row: Status Tag + Price
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding:  EdgeInsets.symmetric(
                          horizontal: 12, vertical: 5),
                      decoration: BoxDecoration(
                        color:  Color(0xFFFFF0F3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        booking["status"],
                        style: FTextStyle.desc(context).copyWith(
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                    Text(
                      booking["price"],
                      style: FTextStyle.price(context)
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildHistoryEmptyState() {
    return Center(
      child: Padding(
        padding:  EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Pink Neutral Face Graphic Badge (Figma Screenshot 2)
            Container(
              width: 90,
              height: 90,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.primaryLight,
              ),
              child: Center(
                child: Container(
                  width: 56,
                  height: 56,
                  decoration:  BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.primary,
                  ),
                  child:  Icon(
                    Icons.sentiment_dissatisfied_rounded,
                    color: Colors.white,
                    size: 36,
                  ),
                ),
              ),
            ),

             SizedBox(height: 14),

            Text(
              "You don't have an history!",
              style: FTextStyle.header(context)
            ),

             SizedBox(height: 10),

            Text(
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
              textAlign: TextAlign.center,
              style: FTextStyle.desc(context)
            ),
          ],
        ),
      ),
    );
  }
}
