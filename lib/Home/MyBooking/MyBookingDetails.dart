import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'BookingReschedule.dart';
import 'cancelBooking.dart';

class MyBookingDetailsScreen extends StatelessWidget {
  final String serviceTitle;
  final String imageUrl;
  final String package;
  final String beautician;
  final String bookingDate;
  final String price;

   MyBookingDetailsScreen({
    super.key,
    this.serviceTitle = "Euphoria Spa & Beauty Lounge",
    this.imageUrl =
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
    this.package = "Basic",
    this.beautician = "Aria Harris",
    this.bookingDate = "Sun, 20 Dec 2024",
    this.price = "₹1,500.00",
  });

  void _showCancelBookingBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        padding:  EdgeInsets.fromLTRB(20, 12, 20, 34),
        decoration:  BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Top Drag Handle
              Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color:  Color(0xFFE0E1E6),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),

               SizedBox(height: 18),

              // Title: Cancel Booking
              Text(
                Constants.cancelBooking,
                style: FTextStyle.header(context)
              ),

               SizedBox(height: 14),
               Divider(color: Color(0xFFF0F0F3), thickness: 1),
               SizedBox(height: 20),

              // Main Question Header
              Text(
                Constants.areYouSure,
                textAlign: TextAlign.center,
                style: FTextStyle.header(context)
              ),

               SizedBox(height: 12),

              // Action Buttons Row: [ Cancel | Confirm ]
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        side:  BorderSide(
                            color: AppColors.primary, width: 1.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        padding:  EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: Text(
                        Constants.cancel,
                        style: FTextStyle.tittle(context)
                      ),
                    ),
                  ),
                   SizedBox(width: 14),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => CancelBookingScreen(
                              bookingTitle: serviceTitle,
                              paidAmount: price,
                            ),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        padding:  EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: Text(
                        Constants.confirm,
                        style: FTextStyle.tittle(context).copyWith(
                          color: AppColors.white
                        )
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
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
        leading: Center(
          child: GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Icon(
              Icons.arrow_back,
              color: Colors.black,
              size: 20,
            ),
          ),
        ),
        title: Text(
          Constants.myBookings,
          style: FTextStyle.header(context)
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding:  EdgeInsets.symmetric(horizontal: 20, vertical: 2),
                child: Container(
                  width: double.infinity,
                  padding:  EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color:  Color(0xFFEBEBEB)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Thumbnail Image & Info
                      Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(14),
                            child: Image.network(
                              imageUrl,
                              width: 72,
                              height: 72,
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
                                  style: FTextStyle.tittle(context),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                 SizedBox(height: 4),
                                Text(
                                  "Immerse yourself in tranquility with our Relaxation Retreat Package. Enjoy a s...",
                                  style: FTextStyle.desc(context),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),

                       SizedBox(height: 6),
                       Divider(color: Color(0xFFEBEBEB), thickness: 1),
                       SizedBox(height: 2),
                      // Your Order Section
                      Text(
                        Constants.yourOrder,
                        style: FTextStyle.header(context)
                      ),
                       SizedBox(height: 5),
                      _buildSummaryRow(context, Constants.package, package),
                       SizedBox(height: 8),
                      _buildSummaryRow(context, Constants.beautician, beautician),
                       SizedBox(height: 8),
                      _buildSummaryRow(context, Constants.date, bookingDate),

                       SizedBox(height: 16),
                       Divider(color: Color(0xFFEBEBEB), thickness: 1),
                       SizedBox(height: 12),

                      // Price Details Section
                      Text(
                        Constants.priceDetails,
                        style: FTextStyle.header(context)
                      ),
                       SizedBox(height: 10),

                      _buildSummaryRow(context, Constants.price, price),
                       SizedBox(height: 8),
                      _buildSummaryRow(context, Constants.free, "₹20.00"),
                       SizedBox(height: 10),
                      _buildSummaryRow(
                        context,
                        Constants.totalAmount,
                        price,
                        isBold: true,
                        valueColor: AppColors.textPrimary,
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Actions (View Invoice + Cancel Booking)
            Padding(
              padding:  EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: Column(
                children: [
                  CustomButton(
                    text: Constants.reschedule,
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => BookingRescheduleScreen(
                          ),
                        ),
                      );
                    },
                    height: 52,
                    borderRadius: 16,
                  ),

                   SizedBox(height: 14),

                  GestureDetector(
                    onTap: () => _showCancelBookingBottomSheet(context),
                    child: Container(
                      padding:  EdgeInsets.symmetric(vertical: 8),
                      child: Text(
                        Constants.cancelBooking,
                        style: FTextStyle.tittle(context).copyWith(
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(
    BuildContext context,
    String label,
    String value, {
    bool isBold = false,
    Color? valueColor,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: FTextStyle.desc(context)
        ),
        Text(
          value,
          style: FTextStyle.tittle(context)
        ),
      ],
    );
  }
}
