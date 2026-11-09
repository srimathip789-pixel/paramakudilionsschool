import React from 'react';
import CommitteeMemberDisplay from '@/components/public/CommitteeMemberDisplay';

export default function TreasurerMessagePage() {
  return <CommitteeMemberDisplay roleFilter="Treasurer" pageTitle="Treasurer's Message" />;
}
