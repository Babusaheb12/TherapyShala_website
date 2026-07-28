import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import '../appointments/eRecipt.dart';
import 'BookingReschedule.dart';

class MyBookingDetailsScreen extends StatelessWidget {
  final String serviceTitle;
  final String imageUrl;
  final String package;
  final String beautician;
  final String bookingDate;
  final String price;

  const MyBookingDetailsScreen({
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
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 34),
        decoration: const BoxDecoration(
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
                  color: const Color(0xFFE0E1E6),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),

              const SizedBox(height: 18),

              // Title: Cancel Booking
              Text(
                "Cancel Booking",
                style: FTextStyle.tittle(context).copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),

              const SizedBox(height: 14),
              const Divider(color: Color(0xFFF0F0F3), thickness: 1),
              const SizedBox(height: 20),

              // Main Question Header
              Text(
                "Are you sure want to cancel your clinic booking?",
                textAlign: TextAlign.center,
                style: FTextStyle.header(context).copyWith(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),

              const SizedBox(height: 12),

              // Subtitle Description
              Text(
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                textAlign: TextAlign.center,
                style: FTextStyle.desc(context).copyWith(
                  color: const Color(0xFF9CA3B1),
                  fontSize: 13,
                  height: 1.5,
                ),
              ),

              const SizedBox(height: 28),

              // Action Buttons Row: [ Cancel | Confirm ]
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(
                            color: AppColors.primary, width: 1.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: Text(
                        "Cancel",
                        style: FTextStyle.tittle(context).copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => BookingRescheduleScreen(
                              bookingTitle: serviceTitle,
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
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: Text(
                        "Confirm",
                        style: FTextStyle.tittle(context).copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
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
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                border: Border.all(color: const Color(0xFFEBEBEB)),
              ),
              child: const Icon(
                Icons.arrow_back,
                color: Colors.black,
                size: 20,
              ),
            ),
          ),
        ),
        title: Text(
          "My Booking",
          style: FTextStyle.header(context).copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFEBEBEB)),
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
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  serviceTitle,
                                  style: FTextStyle.header(context).copyWith(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  "Immerse yourself in tranquility with our Relaxation Retreat Package. Enjoy a s...",
                                  style: FTextStyle.desc(context).copyWith(
                                    color: const Color(0xFF9CA3B1),
                                    fontSize: 12,
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),
                      const Divider(color: Color(0xFFEBEBEB), thickness: 1),
                      const SizedBox(height: 12),

                      // Your Order Section
                      Text(
                        "Your Order",
                        style: FTextStyle.tittle(context).copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 10),

                      _buildSummaryRow(context, "Package", package),
                      const SizedBox(height: 8),
                      _buildSummaryRow(context, "Beautician", beautician),
                      const SizedBox(height: 8),
                      _buildSummaryRow(context, "Dates", bookingDate),

                      const SizedBox(height: 16),
                      const Divider(color: Color(0xFFEBEBEB), thickness: 1),
                      const SizedBox(height: 12),

                      // Price Details Section
                      Text(
                        "Price Details",
                        style: FTextStyle.tittle(context).copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 10),

                      _buildSummaryRow(context, "Price", price),
                      const SizedBox(height: 8),
                      _buildSummaryRow(context, "Fee", "₹20.00"),
                      const SizedBox(height: 10),
                      _buildSummaryRow(
                        context,
                        "Total Price",
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
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: Column(
                children: [
                  CustomButton(
                    text: "Reschedule",
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

                  const SizedBox(height: 14),

                  GestureDetector(
                    onTap: () => _showCancelBookingBottomSheet(context),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Text(
                        "Cancel Booking",
                        style: FTextStyle.tittle(context).copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
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
          style: FTextStyle.desc(context).copyWith(
            color: const Color(0xFF9CA3B1),
            fontSize: 14,
          ),
        ),
        Text(
          value,
          style: FTextStyle.tittle(context).copyWith(
            color: valueColor ?? AppColors.textPrimary,
            fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
            fontSize: isBold ? 15 : 14,
          ),
        ),
      ],
    );
  }
}
