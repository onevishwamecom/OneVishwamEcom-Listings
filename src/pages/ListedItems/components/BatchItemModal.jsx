import React from 'react';
import ItemMediaModal from '../../BulkListing/components/ItemMediaModal';

/**
 * BatchItemModal
 * Reuses the existing ItemMediaModal using props:
 * - `showProductFields={true}` to include Title, Price, Subcategory, Location & Description
 * - `uploadToStorage={true}` to upload media directly to Firebase Storage on save
 *
 * This directly reuses the existing module without recreating extra features or duplicate code.
 */
export default function BatchItemModal(props) {
  return (
    <ItemMediaModal
      {...props}
      showProductFields={true}
      uploadToStorage={true}
    />
  );
}
