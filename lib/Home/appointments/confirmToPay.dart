import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'PaymentSucessfull.dart';

class ConfirmToPayScreen extends StatefulWidget {
  final String serviceTitle;
  final String package;
  final String beautician;
  final String bookingDate;
  final String bookingHours;
  final String price;

   ConfirmToPayScreen({
    super.key,
    this.serviceTitle = "Euphoria Spa & Beauty Lounge",
    this.package = "Basic",
    this.beautician = "Aria Harris",
    this.bookingDate = "December 28, 2024",
    this.bookingHours = "11.00 AM",
    this.price = "₹1,500.00",
  });

  @override
  State<ConfirmToPayScreen> createState() => _ConfirmToPayScreenState();
}

class _ConfirmToPayScreenState extends State<ConfirmToPayScreen> {
  String _selectedPaymentMethod = "PayPal";
  String _paymentEmail = "ameliawilson@gmail.com";

  final List<Map<String, dynamic>> _paymentOptions = [
    {
      "name": "Apple Pay",
      "icon": Icons.apple,
      "color": Colors.black,
    },
    {
      "name": "Google Pay",
      "icon": Icons.g_mobiledata_rounded,
      "color":  Color(0xFF4285F4),
    },
    {
      "name": "PayPal",
      "icon": Icons.account_balance_wallet_rounded,
      "color":  Color(0xFF003087),
    },
    {
      "name": "Stripe",
      "icon": Icons.credit_card_rounded,
      "color":  Color(0xFF6772E5),
    },
  ];

  void _showPaymentMethodSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _PaymentMethodBottomSheet(
        currentMethod: _selectedPaymentMethod,
        options: _paymentOptions,
        onSelectMethod: (method) {
          setState(() {
            _selectedPaymentMethod = method;
          });
        },
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
            child:  Icon(
              Icons.arrow_back,
              color: Colors.black,
              size: 20,
            ),
          ),
        ),
        title: Text(
          "Confirm & Pay",
          style: FTextStyle.header(context)
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding:  EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Order Summary Card
                    Container(
                      width: double.infinity,
                      padding:  EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color:  AppColors.border),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Service Thumbnail & Info Row
                          Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(14),
                                child: Image.network(
                                  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
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
                                      widget.serviceTitle,
                                      style: FTextStyle.tittle(context),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                     SizedBox(height: 4),
                                    Text(
                                      "Immerse yourself in tranquility with our Relaxation Retreat Package...",
                                      style: FTextStyle.desc(context),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),

                           SizedBox(height: 16),
                           Divider(color: Color(0xFFEBEBEB), thickness: 1),
                           SizedBox(height: 12),

                          // Your Order Header
                          Text(
                            "Your Order",
                            style: FTextStyle.header(context)
                          ),
                           SizedBox(height: 10),

                          _buildSummaryRow(context, "Package", widget.package),
                           SizedBox(height: 8),
                          _buildSummaryRow(
                              context, "Beautician", widget.beautician),
                           SizedBox(height: 8),
                          _buildSummaryRow(context, "Dates",
                              "${widget.bookingDate} (${widget.bookingHours})"),

                           SizedBox(height: 6),
                           Divider(color: Color(0xFFEBEBEB), thickness: 1),
                           SizedBox(height: 4),

                          // Price Details Header
                          Text(
                            "Price Details",
                            style: FTextStyle.header(context)
                          ),
                           SizedBox(height: 10),

                          _buildSummaryRow(context, "Price", widget.price),
                           SizedBox(height: 8),
                          _buildSummaryRow(context, "Fee", "₹20.00"),
                           SizedBox(height: 10),
                          _buildSummaryRow(
                            context,
                            "Total Price",
                            widget.price,
                            isBold: true,
                            valueColor: AppColors.textPrimary,
                          ),
                        ],
                      ),
                    ),

                     SizedBox(height: 24),

                    // Payment Method Header & Change Button
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Payment Method",
                          style: FTextStyle.header(context)
                        ),
                        GestureDetector(
                          onTap: _showPaymentMethodSheet,
                          child: Text(
                            "Change",
                            style: FTextStyle.textButton(context)
                          ),
                        ),
                      ],
                    ),

                     SizedBox(height: 12),

                    // Selected Payment Card
                    GestureDetector(
                      onTap: _showPaymentMethodSheet,
                      child: Container(
                        padding:  EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color:  AppColors.border),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration:  BoxDecoration(
                                color: Color(0xFFF5F6F8),
                                shape: BoxShape.circle,
                                border: Border.all(color: AppColors.border),
                              ),
                              child: Icon(
                                _selectedPaymentMethod == "Apple Pay"
                                    ? Icons.apple
                                    : _selectedPaymentMethod == "Google Pay"
                                        ? Icons.g_mobiledata_rounded
                                        : _selectedPaymentMethod == "PayPal"
                                            ? Icons.account_balance_wallet_rounded
                                            : Icons.credit_card_rounded,
                                color: AppColors.primary,
                                size: 24,
                              ),
                            ),
                             SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    _selectedPaymentMethod,
                                    style: FTextStyle.tittle(context)
                                  ),
                                   SizedBox(height: 2),
                                  Text(
                                    _paymentEmail,
                                    style: FTextStyle.desc(context)
                                  ),
                                ],
                              ),
                            ),
                             Icon(
                              Icons.chevron_right_rounded,
                              color: Color(0xFF9CA3B1),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Fixed Pay Now Button
            Padding(
              padding:  EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: CustomButton(
                text: "Pay Now",
                onPressed: () {
                  PaymentSuccessfulScreen.show(
                    context,
                    serviceTitle: widget.serviceTitle,
                    bookingDate: widget.bookingDate,
                    bookingHours: widget.bookingHours,
                    beautician: widget.beautician,
                    package: widget.package,
                    totalPrice: widget.price,
                  );
                },
                height: 52,
                borderRadius: 16,
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

// Payment Method Selection Bottom Sheet (Figma Screenshot 1)
class _PaymentMethodBottomSheet extends StatefulWidget {
  final String currentMethod;
  final List<Map<String, dynamic>> options;
  final ValueChanged<String> onSelectMethod;

   _PaymentMethodBottomSheet({
    required this.currentMethod,
    required this.options,
    required this.onSelectMethod,
  });

  @override
  State<_PaymentMethodBottomSheet> createState() =>
      __PaymentMethodBottomSheetState();
}

class __PaymentMethodBottomSheetState
    extends State<_PaymentMethodBottomSheet> {
  late String _selected;

  @override
  void initState() {
    super.initState();
    _selected = widget.currentMethod;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding:  EdgeInsets.fromLTRB(20, 16, 20, 28),
      decoration:  BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag Handle
            Center(
              child: Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color:  Color(0xFFE0E1E6),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),

             SizedBox(height: 16),

            Center(
              child: Text(
                "Payment Method",
                style: FTextStyle.header(context)
              ),
            ),

             SizedBox(height: 10),

            // Payment Options List
            Column(
              children: widget.options.map((opt) {
                final String name = opt["name"];
                final bool isSelected = name == _selected;

                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selected = name;
                    });
                  },
                  child: Container(
                    margin:  EdgeInsets.only(bottom: 12),
                    padding:  EdgeInsets.symmetric(
                        horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: isSelected
                          ?  Color(0xFFFFF0F3) // Soft pink tint as in Figma 1
                          : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected
                            ? AppColors.primary
                            :  Color(0xFFEBEBEB),
                        width: isSelected ? 1.5 : 1.0,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          opt["icon"] as IconData,
                          color: isSelected ? AppColors.primary : opt["color"],
                          size: 24,
                        ),
                         SizedBox(width: 14),
                        Expanded(
                          child: Text(
                            name,
                            style: FTextStyle.tittle(context).copyWith(
                              color: isSelected
                                  ? AppColors.primary
                                  : AppColors.textPrimary,
                            ),
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

             SizedBox(height: 3),

            // Bottom Add Card Button
            CustomButton(
              text: "Add Card",
              onPressed: () {
                widget.onSelectMethod(_selected);
                Navigator.pop(context);
              },
              height: 52,
              borderRadius: 16,
            ),
          ],
        ),
      ),
    );
  }
}
