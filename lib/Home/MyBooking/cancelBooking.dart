import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';

import '../../utils/constants.dart';

class CancelBookingScreen extends StatefulWidget {
  final String bookingTitle;
  final String paidAmount;
  final String refundAmount;

  CancelBookingScreen({
    super.key,
    this.bookingTitle = "Euphoria Spa & Beauty Lounge",
    this.paidAmount = "₹1,500.00",
    this.refundAmount = "₹1,200.00",
  });

  @override
  State<CancelBookingScreen> createState() => _CancelBookingScreenState();
}

class _CancelBookingScreenState extends State<CancelBookingScreen> {
  String _selectedPaymentMethod = "PayPal";

  final List<Map<String, dynamic>> _refundMethods = [
    {
      "name": "Apple Pay",
      "icon": Icons.apple,
      "color": Colors.black,
    },
    {
      "name": "Google Pay",
      "icon": Icons.g_mobiledata_rounded,
      "color": Color(0xFF4285F4),
    },
    {
      "name": "PayPal",
      "icon": Icons.payment_rounded,
      "color": Color(0xFF003087),
    },
  ];

  void _showRefundCompletedDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
        elevation: 0,
        backgroundColor: Colors.white,
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Icon with double concentric circles
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  color: Color(0xFFFFF0F3), // Soft pink outer circle
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: AppColors.primary, // Inner pink circle
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.check_rounded,
                      color: Colors.white,
                      size: 34,
                    ),
                  ),
                ),
              ),
              SizedBox(height: 20),
              // Title
              Text(
                Constants.refundCompleted,
                style: FTextStyle.header(context),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 10),
              // Description
              Text(
                Constants.refundDescription,
                style: FTextStyle.desc(context),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20),
              // Button
              CustomButton(
                text: Constants.thankYou,
                onPressed: () {
                  Navigator.pop(context); // Close Dialog
                  Navigator.pop(context); // Close CancelBookingScreen
                },
                height: 50,
                borderRadius: 16,
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
              size: 18,
            ),
          ),
        ),
        title: Text(
          Constants.cancelBooking,
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Please select a payment refund method (only 80% will be refunded).",
                      style: FTextStyle.tittle(context)
                    ),
                    SizedBox(height: 20),
                    // Payment options list
                    Column(
                      children: _refundMethods.map((method) {
                        final String name = method["name"];
                        final bool isSelected = name == _selectedPaymentMethod;

                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedPaymentMethod = name;
                            });
                          },
                          child: Container(
                            margin: EdgeInsets.only(bottom: 14),
                            padding: EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 18,
                            ),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? Color(0xFFFFF0F3)
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected
                                    ? AppColors.primary
                                    : Color(0xFFEBEBEB),
                                width: isSelected ? 1.5 : 1.0,
                              ),
                            ),
                            child: Row(
                              children: [
                                _buildMethodIcon(name, method["icon"], method["color"]),
                                SizedBox(width: 14),
                                Expanded(
                                  child: Text(
                                    name,
                                    style: FTextStyle.tittle(context)
                                  ),
                                ),
                                if (isSelected)
                                  Icon(
                                    Icons.check_circle_rounded,
                                    color: AppColors.primary,
                                    size: 22,
                                  ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ),
            // Bottom Refund section
            Padding(
              padding: EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Paid ${widget.paidAmount}",
                        style: FTextStyle.desc(context)
                      ),
                      SizedBox(width: 16),
                      Text(
                        "Refund ${widget.refundAmount}",
                        style: FTextStyle.tittle(context)
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  CustomButton(
                    text: Constants.refund,
                    onPressed: _showRefundCompletedDialog,
                    height: 52,
                    borderRadius: 16,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMethodIcon(String name, IconData defaultIcon, Color iconColor) {
    if (name == "Google Pay") {
      return Icon(
        Icons.g_mobiledata_rounded,
        color: Color(0xFF4285F4),
        size: 32,
      );
    }
    if (name == "PayPal") {
      return Icon(
        Icons.payment_rounded,
        color: Color(0xFF003087),
        size: 24,
      );
    }
    return Icon(
      defaultIcon,
      color: iconColor,
      size: 24,
    );
  }
}
