import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';

import '../../utils/constants.dart';

class HelpCenterScreen extends StatefulWidget {
  HelpCenterScreen({super.key});

  @override
  State<HelpCenterScreen> createState() => _HelpCenterScreenState();
}

class _HelpCenterScreenState extends State<HelpCenterScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";

  final List<Map<String, String>> _faqs = [
    {
      "question": "How do I book a spa session at home?",
      "answer":
          "You can browse available services, choose a suitable package and time slot, select your preferred therapist, and confirm your booking through the app."
    },
    {
      "question": "What is the cancellation policy?",
      "answer":
          "Turpis lectus egestas dui proin natoque nulla egestas fames molestie. Euismod orci nisl enim pharetra lectus morbi massa nibh non."
    },
    {
      "question": "How do refunds work upon cancellation?",
      "answer":
          "Refunds are processed within 3-5 business days to your original payment method (80% refund policy applies for standard cancellations)."
    },
    {
      "question": "Can I reschedule my appointment?",
      "answer":
          "Yes, you can request a reschedule up to 2 hours before your scheduled booking time directly from the My Bookings section."
    },
    {
      "question": "What payment methods are supported?",
      "answer":
          "We accept Credit/Debit cards, Net Banking, UPI, Apple Pay, Google Pay, and PayPal."
    },
    {
      "question": "Are all therapists verified?",
      "answer":
          "Yes, all therapists on TherapyShala undergo thorough background verification and professional certification checks."
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filteredFaqs = _faqs.where((faq) {
      return _searchQuery.isEmpty ||
          faq["question"]!
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()) ||
          faq["answer"]!.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

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
          Constants.helpCenter,
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Bar with Filter Icon
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Container(
                height: 50,
                decoration: BoxDecoration(
                  color: Color(0xFFF7F8FA),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: (val) {
                    setState(() {
                      _searchQuery = val;
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
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ),

            SizedBox(height: 8),

            // FAQs List (Accordion Expansion Tiles)
            Expanded(
              child: filteredFaqs.isEmpty
                  ? Center(
                      child: Text(
                        Constants.noHelpTopicsFound,
                        style: FTextStyle.desc(context),
                      ),
                    )
                  : ListView.separated(
                      padding: EdgeInsets.symmetric(horizontal: 20),
                      itemCount: filteredFaqs.length,
                      separatorBuilder: (context, index) => Divider(color: Color(0xFFF0F0F3), height: 1),
                      itemBuilder: (context, index) {
                        final item = filteredFaqs[index];
                        return Theme(
                          data: Theme.of(context).copyWith(
                            dividerColor: Colors.transparent,
                          ),
                          child: ExpansionTile(
                            tilePadding: EdgeInsets.symmetric(vertical: 1),
                            title: Text(
                              item["question"]!,
                              style: FTextStyle.tittle(context)
                            ),
                            iconColor: AppColors.textPrimary,
                            collapsedIconColor: AppColors.textPrimary,
                            children: [
                              Padding(
                                padding: EdgeInsets.only(bottom: 14),
                                child: Text(
                                  item["answer"]!,
                                  style: FTextStyle.desc(context)
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
