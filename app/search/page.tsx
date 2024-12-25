'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import VehicleSearch from '../../components/VehicleSearch'
import SearchResults from '../../components/SearchResults'
import Map from '../../components/Map'
import ShoppingCart from '../../components/ShoppingCart'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchData, setSearchData] = useState(Object.fromEntries(searchParams || []))

  const handleSearch = (data: any) => {
    setSearchData(data)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Search Transfers</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Search</CardTitle>
              </CardHeader>
              <CardContent>
                <VehicleSearch onSearch={handleSearch} onSubmit={(service) => { /* handle submit */ }} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
              </CardHeader>
              <CardContent>
                <ShoppingCart />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Map</CardTitle>
              </CardHeader>
              <CardContent>
                <Map searchData={searchData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchResults searchParams={searchData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

