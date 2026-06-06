# Firestore Security Spec

## 1. Data Invariants
- **Users**: Users can only read and write their own profile document. No user can escalate their own balance or modify other users' documents.
- **Products**: Anyone can read 'active' products in the marketplace. Only the creator (or an admin) can create, update, or delete a product. A product cannot be created with a mismatching creatorId.
- **Sales**: A sale can only be read by its buyer, the product creator, the affiliate (if any), or an admin. Sales status changes are strictly controlled.
- **Affiliations**: Anyone can query affiliations for clicks, but create and updates are restricted to the affiliate who owns the affiliation record.
- **Tickets**: Tickets are owned by the creator. Users can retrieve and send messages on their own tickets, while support/admin can manage all tickets.
- **LandingPages**: Publicly readable. Only the product's creator or admin can modify sections and theme.
- **Transfers**: Requesting a withdrawal is restricted to the logged-in merchant (producer/affiliate). Approving or rejecting is exclusive to global Admins.

## 2. The "Dirty Dozen" Payloads (Aesthetic Anti-Patterns to Reject)
1. **Balance Injection**: User modifies `/users/attacker` to set `balance = 999999`.
2. **Identity Theft**: User creates `/products/new_product` with `creatorId = "legit_user"`.
3. **Price Alteration**: Affiliate updates `/products/some_id` to set `price = 0.01` to purchase cheaply.
4. **Direct Approvals**: Producer directly updates their own product status from `pending_approval` to `active` bypasses admin.
5. **Unauthorized Sale Creation**: Attacker creates `/sales/fake_sale` where `amount = 0` but marks `status = "completed"`.
6. **Ticket Impersonation**: Guest user reads tickets for `/tickets/private_user_ticket`.
7. **Cross-Affiliation Hijack**: Affiliate updates another's `/affiliations/rule` to set `affiliateId` to themselves.
8. **Withdrawal Self-Approval**: Merchant updates `/transfers/my_request` to set `status = "approved"`.
9. **Page Override**: Attacker replaces sections of landing page `/pages/popular_product_page` with spam.
10. **Admin Claim Mocking**: Anonymous client injects `isAdmin = true` dynamic claims.
11. **Excessive Field Injection**: Attacker injects a 5MB payload into a text field.
12. **Negative Balance Hack**: Attacker initiates a negative balance withdraw request of `-R$ 5000` to magically deduct.

## 3. Hardened Security Plan
Our `firestore.rules` will strictly prevent these 12 attacks through exact schema checking, `request.auth.uid` validation, and immutability controls.
